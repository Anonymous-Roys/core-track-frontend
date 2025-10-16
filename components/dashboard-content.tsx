"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Camera,
  FileText,
  Beaker,
} from "lucide-react"
import Link from "next/link"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

// Mock data based on the Excel spreadsheet
const mockDrillHoles = [
  // BLOCK 4
  {
    id: "IDD4074",
    siteId: "Blk4_021",
    location: "BLOCK 4",
    status: "DRILLED",
    plannedDepth: 475,
    drilledDepth: 521.7,
    startDate: "23-Oct-24",
    endDate: "12-Dec-24",
    statusNote: "Drilled from 2024",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDD4076",
    siteId: "Blk4_2025_005",
    location: "BLOCK 4",
    status: "DRILLED",
    plannedDepth: 520,
    drilledDepth: 573.5,
    startDate: "19-Feb-25",
    endDate: "25-Mar-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDD4077",
    siteId: "Blk4_2025_007",
    location: "BLOCK 4",
    status: "DRILLED",
    plannedDepth: 570,
    drilledDepth: 647.4,
    startDate: "26-Mar-25",
    endDate: "12-Jun-24",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDD4079",
    siteId: "Blk4_2025_001A",
    location: "BLOCK 4",
    status: "DRILLING",
    plannedDepth: 570,
    drilledDepth: 278,
    startDate: "12-Sep-25",
    endDate: "Ongoing",
    statusNote: "Ongoing",
    hasPhoto: false,
    hasLitho: false,
    hasSamples: false,
  },
  {
    id: "IDD4078",
    siteId: "Blk4_2025_003A",
    location: "BLOCK 4",
    status: "DRILLED",
    plannedDepth: 485,
    drilledDepth: 495.8,
    startDate: "16-Jun-25",
    endDate: "12-Sep-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDD4080",
    siteId: "Blk4_2025_006A",
    location: "BLOCK 4",
    status: "NOT DRILLED",
    plannedDepth: 560,
    drilledDepth: 0,
    startDate: "",
    endDate: "",
    statusNote: "Not Drilled",
    hasPhoto: false,
    hasLitho: false,
    hasSamples: false,
  },

  // BLOCK 2&3
  {
    id: "IDDUG016",
    siteId: "IDDUG016",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 550,
    drilledDepth: 556.7,
    startDate: "11-Nov-24",
    endDate: "16-Dec-24",
    statusNote: "Drilled in 2024",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDD420",
    siteId: "IDD420",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 400,
    drilledDepth: 384.6,
    startDate: "28-Nov-24",
    endDate: "13-Dec-24",
    statusNote: "Drilled in 2024",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDD2025_001",
    siteId: "IDD2025_001",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 450,
    drilledDepth: 446,
    startDate: "27-Jan-25",
    endDate: "11-Feb-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDDUG003",
    siteId: "IDDUG003",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 470,
    drilledDepth: 462.5,
    startDate: "25-Feb-25",
    endDate: "21-Mar-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDD2025_013",
    siteId: "IDD2025_013",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 370,
    drilledDepth: 377.9,
    startDate: "27-Jan-25",
    endDate: "21-Feb-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDDUG024",
    siteId: "IDDUG024",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 360,
    drilledDepth: 360.8,
    startDate: "3-Mar-25",
    endDate: "24-Mar-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDDUG025A",
    siteId: "IDDUG025A",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 580,
    drilledDepth: 600,
    startDate: "17-Apr-25",
    endDate: "26-Apr-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDDUG033",
    siteId: "IDDUG033",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 550,
    drilledDepth: 633.6,
    startDate: "28-Mar-25",
    endDate: "13-May-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDDUG019",
    siteId: "IDDUG019",
    location: "BLOCK 2&3",
    status: "ABANDONED",
    plannedDepth: 670,
    drilledDepth: 443.4,
    startDate: "30-Jun-25",
    endDate: "23-Aug-25",
    statusNote: "ABANDONED",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: false,
  },
  {
    id: "IDDUG034",
    siteId: "IDDUG034",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 530,
    drilledDepth: 637,
    startDate: "11-Aug-25",
    endDate: "16-Sep-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDDUG044",
    siteId: "IDDUG044",
    location: "BLOCK 2&3",
    status: "DRILLED",
    plannedDepth: 375,
    drilledDepth: 369.5,
    startDate: "16-Jun-25",
    endDate: "5-Aug-25",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "IDDUG021",
    siteId: "IDDUG021",
    location: "BLOCK 2&3",
    status: "NOT DRILLED",
    plannedDepth: 450,
    drilledDepth: 0,
    startDate: "",
    endDate: "",
    statusNote: "Not Drilled",
    hasPhoto: false,
    hasLitho: false,
    hasSamples: false,
  },
  {
    id: "IDDUG042",
    siteId: "IDDUG042",
    location: "BLOCK 2&3",
    status: "NOT DRILLED",
    plannedDepth: 685,
    drilledDepth: 0,
    startDate: "",
    endDate: "",
    statusNote: "Not Drilled",
    hasPhoto: false,
    hasLitho: false,
    hasSamples: false,
  },
  {
    id: "IDDUG026",
    siteId: "IDDUG026",
    location: "BLOCK 2&3",
    status: "NOT DRILLED",
    plannedDepth: 570,
    drilledDepth: 0,
    startDate: "",
    endDate: "",
    statusNote: "Not Drilled",
    hasPhoto: false,
    hasLitho: false,
    hasSamples: false,
  },

  // BLOCK 5
  {
    id: "Bk3_2025_002A",
    siteId: "Bk3_2025_002A",
    location: "BLOCK 5",
    status: "DRILLED",
    plannedDepth: 324,
    drilledDepth: 440.6,
    startDate: "2-Sep-25",
    endDate: "Ongoing",
    statusNote: "Complete",
    hasPhoto: true,
    hasLitho: true,
    hasSamples: true,
  },
  {
    id: "Bk5_2025_001",
    siteId: "Bk5_2025_001",
    location: "BLOCK 5",
    status: "NOT DRILLED",
    plannedDepth: 505,
    drilledDepth: 0,
    startDate: "",
    endDate: "",
    statusNote: "Not Drilled",
    hasPhoto: false,
    hasLitho: false,
    hasSamples: false,
  },
  {
    id: "Bk5_2025_004A",
    siteId: "Bk5_2025_004A",
    location: "BLOCK 5",
    status: "NOT DRILLED",
    plannedDepth: 500,
    drilledDepth: 0,
    startDate: "",
    endDate: "",
    statusNote: "Not Drilled",
    hasPhoto: false,
    hasLitho: false,
    hasSamples: false,
  },

  // BLOCK 8
  {
    id: "IDDUG023",
    siteId: "IDDUG023",
    location: "BLOCK 8",
    status: "NOT DRILLED",
    plannedDepth: 630,
    drilledDepth: 0,
    startDate: "",
    endDate: "",
    statusNote: "Not Drilled",
    hasPhoto: false,
    hasLitho: false,
    hasSamples: false,
  },
  {
    id: "IDDUG041",
    siteId: "IDDUG041",
    location: "BLOCK 8",
    status: "NOT DRILLED",
    plannedDepth: 700,
    drilledDepth: 0,
    startDate: "",
    endDate: "",
    statusNote: "Not Drilled",
    hasPhoto: false,
    hasLitho: false,
    hasSamples: false,
  },
]

interface DashboardContentProps {
  selectedProject: string
}

export function DashboardContent({ selectedProject }: DashboardContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [expandedLocations, setExpandedLocations] = useState<string[]>(["BLOCK 4", "BLOCK 2&3", "BLOCK 5", "BLOCK 8"])
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  // Calculate KPIs
  const kpis = useMemo(() => {
    const drilled = mockDrillHoles.filter((h) => h.status === "DRILLED").length
    const drilling = mockDrillHoles.filter((h) => h.status === "DRILLING").length
    const notDrilled = mockDrillHoles.filter((h) => h.status === "NOT DRILLED").length
    const abandoned = mockDrillHoles.filter((h) => h.status === "ABANDONED").length
    const totalMeters = mockDrillHoles
      .filter((h) => h.status === "DRILLED" || h.status === "ABANDONED")
      .reduce((sum, h) => sum + h.drilledDepth, 0)
    const avgDepth = totalMeters / (drilled + abandoned) || 0

    return { drilled, drilling, notDrilled, abandoned, totalMeters, avgDepth }
  }, [])

  // Status distribution data for pie chart
  const statusData = [
    { name: "Drilled", value: kpis.drilled, color: "#22c55e" },
    { name: "Drilling", value: kpis.drilling, color: "#3b82f6" },
    { name: "Planned", value: kpis.notDrilled, color: "#9ca3af" },
    { name: "Abandoned", value: kpis.abandoned, color: "#f59e0b" },
  ]

  // Meters drilled by location for bar chart
  const locationData = useMemo(() => {
    const locations = ["BLOCK 4", "BLOCK 2&3", "BLOCK 5", "BLOCK 8"]
    return locations.map((location) => {
      const holes = mockDrillHoles.filter(
        (h) => h.location === location && (h.status === "DRILLED" || h.status === "ABANDONED"),
      )
      const totalMeters = holes.reduce((sum, h) => sum + h.drilledDepth, 0)
      const holeCount = holes.length
      return { location, meters: totalMeters, holes: holeCount }
    })
  }, [])

  // Drilling timeline data (monthly aggregation)
  const timelineData = useMemo(() => {
    const monthlyData: Record<string, { month: string; holes: number; meters: number }> = {}

    mockDrillHoles.forEach((hole) => {
      if (hole.endDate && hole.endDate !== "Ongoing" && hole.endDate !== "") {
        // Parse date format like "12-Dec-24"
        const parts = hole.endDate.split("-")
        if (parts.length === 3) {
          const monthYear = `${parts[1]}-${parts[2]}`
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { month: monthYear, holes: 0, meters: 0 }
          }
          monthlyData[monthYear].holes += 1
          monthlyData[monthYear].meters += hole.drilledDepth
        }
      }
    })

    return Object.values(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.month.split("-")
      const [monthB, yearB] = b.month.split("-")
      return yearA.localeCompare(yearB) || monthA.localeCompare(monthB)
    })
  }, [])

  // Depth distribution data
  const depthDistribution = useMemo(() => {
    const ranges = [
      { range: "0-300m", min: 0, max: 300, count: 0 },
      { range: "300-400m", min: 300, max: 400, count: 0 },
      { range: "400-500m", min: 400, max: 500, count: 0 },
      { range: "500-600m", min: 500, max: 600, count: 0 },
      { range: "600-700m", min: 600, max: 700, count: 0 },
      { range: "700+m", min: 700, max: Number.POSITIVE_INFINITY, count: 0 },
    ]

    mockDrillHoles.forEach((hole) => {
      const depth = hole.plannedDepth
      const range = ranges.find((r) => depth >= r.min && depth < r.max)
      if (range) range.count += 1
    })

    return ranges.filter((r) => r.count > 0)
  }, [])

  // Filter holes
  const filteredHoles = useMemo(() => {
    return mockDrillHoles.filter((hole) => {
      const matchesSearch =
        hole.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hole.siteId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || hole.status === statusFilter
      const matchesLocation = locationFilter === "all" || hole.location === locationFilter

      return matchesSearch && matchesStatus && matchesLocation
    })
  }, [searchQuery, statusFilter, locationFilter])

  // Group by location
  const groupedHoles = useMemo(() => {
    const groups: Record<string, typeof mockDrillHoles> = {}
    filteredHoles.forEach((hole) => {
      if (!groups[hole.location]) {
        groups[hole.location] = []
      }
      groups[hole.location].push(hole)
    })
    return groups
  }, [filteredHoles])

  const toggleLocation = (location: string) => {
    setExpandedLocations((prev) => (prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRILLED":
        return "text-green-600 bg-green-50 border-green-200"
      case "DRILLING":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "NOT DRILLED":
        return "text-gray-600 bg-gray-50 border-gray-200"
      case "ABANDONED":
        return "text-amber-600 bg-amber-50 border-amber-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case "DRILLED":
        return "bg-green-500"
      case "DRILLING":
        return "bg-blue-500"
      case "NOT DRILLED":
        return "bg-gray-400"
      case "ABANDONED":
        return "bg-amber-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Drilling Operations Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Monitor and manage drill hole operations</p>
        </div>
        <div className="flex gap-2">
          <Link href="/create-hole">
            <Button size="sm" className="min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create New Hole</span>
              <span className="sm:hidden">New Hole</span>
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="min-h-[44px] bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="min-h-[44px] bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Drilled Holes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{kpis.drilled}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">holes completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Currently Drilling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{kpis.drilling}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">holes in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Planned Holes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-400" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-600">{kpis.notDrilled}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">holes not started</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Abandoned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <div className="text-2xl sm:text-3xl font-bold text-amber-600">{kpis.abandoned}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">holes abandoned</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  className="sm:outerRadius-[80]"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Meters Drilled by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="meters" fill="#3b82f6" name="Meters Drilled" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Drilling Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="holes" stroke="#22c55e" name="Holes Completed" />
                <Line yAxisId="right" type="monotone" dataKey="meters" stroke="#f59e0b" name="Meters Drilled" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Planned Depth Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
              <BarChart data={depthDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="count" fill="#8b5cf6" name="Number of Holes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Hole ID or Site ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 min-h-[44px]"
          />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-[200px] min-h-[44px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="BLOCK 4">BLOCK 4</SelectItem>
            <SelectItem value="BLOCK 2&3">BLOCK 2&3</SelectItem>
            <SelectItem value="BLOCK 5">BLOCK 5</SelectItem>
            <SelectItem value="BLOCK 8">BLOCK 8</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] min-h-[44px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRILLED">Drilled</SelectItem>
            <SelectItem value="DRILLING">Drilling</SelectItem>
            <SelectItem value="NOT DRILLED">Not Drilled</SelectItem>
            <SelectItem value="ABANDONED">Abandoned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {Object.entries(groupedHoles).map(([location, holes]) => (
          <Card key={location}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors min-h-[44px]"
              onClick={() => toggleLocation(location)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  {expandedLocations.includes(location) ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <CardTitle className="text-base sm:text-xl">{location}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {holes.length} holes
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:flex min-h-[44px]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hole
                </Button>
              </div>
            </CardHeader>

            {expandedLocations.includes(location) && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {holes.map((hole) => (
                    <Link key={hole.id} href={`/?holeId=${hole.id}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className={`h-3 w-3 rounded-full ${getStatusDot(hole.status)} flex-shrink-0`} />

                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                          <div className="col-span-2 sm:col-span-1">
                            <div className="font-semibold text-foreground text-sm sm:text-base">{hole.id}</div>
                            <div className="text-xs text-muted-foreground">{hole.siteId}</div>
                          </div>

                          <div>
                            <div className="text-xs text-muted-foreground">Planned</div>
                            <div className="font-medium text-sm">{hole.plannedDepth}m</div>
                          </div>

                          <div>
                            <div className="text-xs text-muted-foreground">Drilled</div>
                            <div className="font-medium text-sm">
                              {hole.drilledDepth > 0 ? `${hole.drilledDepth}m` : "-"}
                            </div>
                            {hole.status === "DRILLING" && hole.drilledDepth > 0 && (
                              <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5 mt-1">
                                <div
                                  className="bg-blue-500 h-1 sm:h-1.5 rounded-full"
                                  style={{ width: `${Math.min((hole.drilledDepth / hole.plannedDepth) * 100, 100)}%` }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="hidden sm:block">
                            <div className="text-xs text-muted-foreground">End Date</div>
                            <div className="font-medium text-sm">{hole.endDate || "-"}</div>
                          </div>

                          <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-start">
                            <Badge className={`${getStatusColor(hole.status)} border text-xs`}>{hole.status}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end sm:justify-start">
                          <div
                            className={`p-1.5 rounded ${hole.hasPhoto ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                          >
                            <Camera className="h-4 w-4" />
                          </div>
                          <div
                            className={`p-1.5 rounded ${hole.hasLitho ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                          >
                            <FileText className="h-4 w-4" />
                          </div>
                          <div
                            className={`p-1.5 rounded ${hole.hasSamples ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                          >
                            <Beaker className="h-4 w-4" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.preventDefault()}
                            className="min-h-[44px] min-w-[44px]"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
