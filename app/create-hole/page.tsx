"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type FormData = {
  // Basic Info
  holeNo: string
  projectId: string
  holeStatus: string
  country: string
  holeType: string
  holeSize: string
  casing: string
  coreStorage: string
  contractor: string
  rigNumber: string
  location: string
  coordinates: { e: string; n: string }
  pitLocation: string
  claimNo: string
  section: string
  loggedBy: string
  loggedByGeologist: string
  authorizationDate: string
  startDate: string
  holeCompletedDate: string
  enteredOn: string

  // Survey & Drilling
  unitOfMeasure: string
  unitOfDegree: string
  maximumDepth: string
  finalDepth: string
  azimuthDec: string
  dipDec: string
  bearing: string
  scribeLine: string
  collarSurvey: boolean
  pulseEmSurvey: boolean
  multiShotSurvey: boolean
  makingWater: boolean
  gasIntersected: boolean
  isHolePlugged: boolean
  isCemented: boolean
  verified: boolean
  objectInHole: boolean
  orientationMark: string

  // Geology
  drillPurpose: string
  domainCode: string
  landUse: string
  miningLevel: string
  crosscut: string
  subLevel: string
  comments: string

  // QA/QC
  confCol: string
  confSur: string
  confMin: string
  confLit: string
  confAss: string
  confRec: string
  caeComments: string
}

export default function CreateHolePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    holeNo: "",
    projectId: "",
    holeStatus: "Planned",
    country: "Ghana",
    holeType: "",
    holeSize: "",
    casing: "",
    coreStorage: "",
    contractor: "",
    rigNumber: "",
    location: "",
    coordinates: { e: "", n: "" },
    pitLocation: "",
    claimNo: "",
    section: "",
    loggedBy: "",
    loggedByGeologist: "",
    authorizationDate: "",
    startDate: "",
    holeCompletedDate: "",
    enteredOn: new Date().toISOString().split("T")[0],
    unitOfMeasure: "meters",
    unitOfDegree: "degrees",
    maximumDepth: "",
    finalDepth: "",
    azimuthDec: "",
    dipDec: "",
    bearing: "",
    scribeLine: "",
    collarSurvey: false,
    pulseEmSurvey: false,
    multiShotSurvey: false,
    makingWater: false,
    gasIntersected: false,
    isHolePlugged: false,
    isCemented: false,
    verified: false,
    objectInHole: false,
    orientationMark: "",
    drillPurpose: "",
    domainCode: "",
    landUse: "",
    miningLevel: "",
    crosscut: "",
    subLevel: "",
    comments: "",
    confCol: "Pending",
    confSur: "Pending",
    confMin: "Pending",
    confLit: "Pending",
    confAss: "Pending",
    confRec: "Pending",
    caeComments: "",
  })

  const tabs = ["Basic Info", "Survey & Drilling", "Geology", "QA/QC"]

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateCoordinates = (axis: "e" | "n", value: string) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: { ...prev.coordinates, [axis]: value },
    }))
  }

  const validateForm = () => {
    const required = [
      "holeNo",
      "projectId",
      "holeStatus",
      "country",
      "holeType",
      "holeSize",
      "contractor",
      "loggedBy",
      "loggedByGeologist",
      "startDate",
      "maximumDepth",
      "azimuthDec",
      "dipDec",
      "drillPurpose",
    ]

    const missing = required.filter((field) => !formData[field as keyof FormData])

    if (missing.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missing.join(", ")}`,
        variant: "destructive",
      })
      return false
    }

    // Validate azimuth range
    const azimuth = Number.parseFloat(formData.azimuthDec)
    if (azimuth < 0 || azimuth > 360) {
      toast({
        title: "Validation Error",
        description: "Azimuth must be between 0-360°",
        variant: "destructive",
      })
      return false
    }

    // Validate dip range
    const dip = Number.parseFloat(formData.dipDec)
    if (dip < -90 || dip > 90) {
      toast({
        title: "Validation Error",
        description: "Dip must be between -90 to +90°",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your drill hole draft has been saved successfully.",
    })
  }

  const handleCreateHole = () => {
    if (!validateForm()) return

    toast({
      title: "Drill Hole Created",
      description: `Drill hole ${formData.holeNo} created successfully!`,
    })

    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gray-800 border-b-2 border-gray-600 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-100 hover:text-white hover:bg-gray-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-gray-100 text-xl font-semibold">Create New Drill Hole</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              className="bg-transparent text-gray-100 border-gray-600 hover:bg-gray-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm" onClick={handleCreateHole} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === index
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-gray-50 border-b px-4 py-2">
        <div className="container mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Step {activeTab + 1} of {tabs.length}: {tabs[activeTab]}
            </span>
            <span>{Math.round(((activeTab + 1) / tabs.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((activeTab + 1) / tabs.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Tab 1: Basic Info */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* Section 1: Identification */}
            <Card>
              <CardHeader>
                <CardTitle>Identification</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="holeNo">
                    Hole No <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="holeNo"
                    value={formData.holeNo}
                    onChange={(e) => updateField("holeNo", e.target.value)}
                    placeholder="DH-001"
                  />
                </div>
                <div>
                  <Label htmlFor="projectId">
                    Project <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.projectId} onValueChange={(value) => updateField("projectId", value)}>
                    <SelectTrigger>
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
                <div>
                  <Label htmlFor="holeStatus">
                    Hole Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.holeStatus} onValueChange={(value) => updateField("holeStatus", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Abandoned">Abandoned</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.country} onValueChange={(value) => updateField("country", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Drilling Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Drilling Specifications</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="holeType">
                    Hole Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.holeType} onValueChange={(value) => updateField("holeType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diamond">Diamond</SelectItem>
                      <SelectItem value="RC">Reverse Circulation (RC)</SelectItem>
                      <SelectItem value="Air Core">Air Core</SelectItem>
                      <SelectItem value="Auger">Auger</SelectItem>
                      <SelectItem value="Trench">Trench</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="holeSize">
                    Hole Size <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.holeSize} onValueChange={(value) => updateField("holeSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PQ">PQ (85mm)</SelectItem>
                      <SelectItem value="HQ">HQ (63.5mm)</SelectItem>
                      <SelectItem value="NQ">NQ (47.6mm)</SelectItem>
                      <SelectItem value="BQ">BQ (36.4mm)</SelectItem>
                      <SelectItem value="TQ">TQ</SelectItem>
                      <SelectItem value="HQ3">HQ3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="casing">Casing</Label>
                  <Select value={formData.casing} onValueChange={(value) => updateField("casing", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Casing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PVC 4 inch">PVC 4 inch</SelectItem>
                      <SelectItem value="PVC 6 inch">PVC 6 inch</SelectItem>
                      <SelectItem value="Steel">Steel</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="coreStorage">Core Storage</Label>
                  <Select value={formData.coreStorage} onValueChange={(value) => updateField("coreStorage", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Storage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Core Shed 1">Core Shed 1</SelectItem>
                      <SelectItem value="Core Shed 2">Core Shed 2</SelectItem>
                      <SelectItem value="Storage Yard A">Storage Yard A</SelectItem>
                      <SelectItem value="Temporary Rack B">Temporary Rack B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contractor">
                    Contractor <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.contractor} onValueChange={(value) => updateField("contractor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Contractor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GeoCore Drilling">GeoCore Drilling</SelectItem>
                      <SelectItem value="Diamond Drilling Co">Diamond Drilling Co</SelectItem>
                      <SelectItem value="RC Specialists">RC Specialists</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rigNumber">Rig Number</Label>
                  <Select value={formData.rigNumber} onValueChange={(value) => updateField("rigNumber", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rig" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RIG-01">RIG-01</SelectItem>
                      <SelectItem value="RIG-02">RIG-02</SelectItem>
                      <SelectItem value="RIG-07">RIG-07</SelectItem>
                      <SelectItem value="RIG-10">RIG-10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Location & Coordinates */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Coordinates</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="location">Location Description</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="East Pit, Grid 450N-200E"
                  />
                </div>
                <div>
                  <Label>
                    Coordinates <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="E: 450123"
                      value={formData.coordinates.e}
                      onChange={(e) => updateCoordinates("e", e.target.value)}
                    />
                    <Input
                      placeholder="N: 789654"
                      value={formData.coordinates.n}
                      onChange={(e) => updateCoordinates("n", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pitLocation">Pit Location</Label>
                  <Select value={formData.pitLocation} onValueChange={(value) => updateField("pitLocation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Pit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North Pit">North Pit</SelectItem>
                      <SelectItem value="East Pit">East Pit</SelectItem>
                      <SelectItem value="Central Pit">Central Pit</SelectItem>
                      <SelectItem value="South Cut">South Cut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="claimNo">Claim No</Label>
                  <Input
                    id="claimNo"
                    value={formData.claimNo}
                    onChange={(e) => updateField("claimNo", e.target.value)}
                    placeholder="CLM-4589"
                  />
                </div>
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Select value={formData.section} onValueChange={(value) => updateField("section", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A-A'">A-A'</SelectItem>
                      <SelectItem value="B-B'">B-B'</SelectItem>
                      <SelectItem value="C-C'">C-C'</SelectItem>
                      <SelectItem value="D-D'">D-D'</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Personnel & Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Personnel & Dates</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="loggedBy">
                    Logged By <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.loggedBy} onValueChange={(value) => updateField("loggedBy", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="J. Smith">J. Smith</SelectItem>
                      <SelectItem value="M. Johnson">M. Johnson</SelectItem>
                      <SelectItem value="K. Williams">K. Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="loggedByGeologist">
                    Geologist <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.loggedByGeologist}
                    onValueChange={(value) => updateField("loggedByGeologist", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Geologist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. L. Turner">Dr. L. Turner</SelectItem>
                      <SelectItem value="Dr. R. Chen">Dr. R. Chen</SelectItem>
                      <SelectItem value="Dr. S. Patel">Dr. S. Patel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="authorizationDate">Authorization Date</Label>
                  <Input
                    id="authorizationDate"
                    type="date"
                    value={formData.authorizationDate}
                    onChange={(e) => updateField("authorizationDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="holeCompletedDate">Hole Completed Date</Label>
                  <Input
                    id="holeCompletedDate"
                    type="date"
                    value={formData.holeCompletedDate}
                    onChange={(e) => updateField("holeCompletedDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="enteredOn">Entered On</Label>
                  <Input id="enteredOn" type="date" value={formData.enteredOn} disabled className="bg-gray-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Survey & Drilling */}
        {activeTab === 1 && (
          <div className="space-y-6">
            {/* Section 1: Drilling Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Drilling Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Unit of Measure <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.unitOfMeasure}
                      onValueChange={(value) => updateField("unitOfMeasure", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="meters" id="meters" />
                        <Label htmlFor="meters" className="font-normal">
                          Meters
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="feet" id="feet" />
                        <Label htmlFor="feet" className="font-normal">
                          Feet
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>
                      Unit of Degree <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.unitOfDegree}
                      onValueChange={(value) => updateField("unitOfDegree", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="degrees" id="degrees" />
                        <Label htmlFor="degrees" className="font-normal">
                          Degrees
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gradians" id="gradians" />
                        <Label htmlFor="gradians" className="font-normal">
                          Gradians
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="radians" id="radians" />
                        <Label htmlFor="radians" className="font-normal">
                          Radians
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maximumDepth">
                      Maximum Depth <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="maximumDepth"
                        type="number"
                        step="0.01"
                        value={formData.maximumDepth}
                        onChange={(e) => updateField("maximumDepth", e.target.value)}
                        placeholder="256.75"
                      />
                      <span className="flex items-center px-3 bg-gray-100 border rounded text-sm">m</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="finalDepth">Final Depth</Label>
                    <div className="flex gap-2">
                      <Input
                        id="finalDepth"
                        type="number"
                        step="0.01"
                        value={formData.finalDepth}
                        onChange={(e) => updateField("finalDepth", e.target.value)}
                        placeholder="254.60"
                      />
                      <span className="flex items-center px-3 bg-gray-100 border rounded text-sm">m</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="azimuthDec">
                      Azimuth (Dec) <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="azimuthDec"
                        type="number"
                        step="0.01"
                        min="0"
                        max="360"
                        value={formData.azimuthDec}
                        onChange={(e) => updateField("azimuthDec", e.target.value)}
                        placeholder="145.25"
                      />
                      <span className="flex items-center px-3 bg-gray-100 border rounded text-sm">°</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Range: 0-360°</p>
                  </div>
                  <div>
                    <Label htmlFor="dipDec">
                      Dip (Dec) <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="dipDec"
                        type="number"
                        step="0.01"
                        min="-90"
                        max="90"
                        value={formData.dipDec}
                        onChange={(e) => updateField("dipDec", e.target.value)}
                        placeholder="-60.5"
                      />
                      <span className="flex items-center px-3 bg-gray-100 border rounded text-sm">°</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Range: -90 to +90°</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bearing">Bearing</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bearing"
                        type="number"
                        step="0.01"
                        value={formData.bearing}
                        onChange={(e) => updateField("bearing", e.target.value)}
                        placeholder="145.3"
                      />
                      <span className="flex items-center px-3 bg-gray-100 border rounded text-sm">°</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="scribeLine">Scribe Line</Label>
                    <Input
                      id="scribeLine"
                      value={formData.scribeLine}
                      onChange={(e) => updateField("scribeLine", e.target.value)}
                      placeholder="Marked at 12m"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Survey Status */}
            <Card>
              <CardHeader>
                <CardTitle>Survey & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="collarSurvey"
                      checked={formData.collarSurvey}
                      onCheckedChange={(checked) => updateField("collarSurvey", checked)}
                    />
                    <Label htmlFor="collarSurvey" className="font-normal">
                      Collar Survey
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="multiShotSurvey"
                      checked={formData.multiShotSurvey}
                      onCheckedChange={(checked) => updateField("multiShotSurvey", checked)}
                    />
                    <Label htmlFor="multiShotSurvey" className="font-normal">
                      Multi-Shot Survey
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pulseEmSurvey"
                      checked={formData.pulseEmSurvey}
                      onCheckedChange={(checked) => updateField("pulseEmSurvey", checked)}
                    />
                    <Label htmlFor="pulseEmSurvey" className="font-normal">
                      Pulse EM Survey
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="makingWater"
                      checked={formData.makingWater}
                      onCheckedChange={(checked) => updateField("makingWater", checked)}
                    />
                    <Label htmlFor="makingWater" className="font-normal">
                      Making Water
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gasIntersected"
                      checked={formData.gasIntersected}
                      onCheckedChange={(checked) => updateField("gasIntersected", checked)}
                    />
                    <Label htmlFor="gasIntersected" className="font-normal">
                      Gas Intersected
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isHolePlugged"
                      checked={formData.isHolePlugged}
                      onCheckedChange={(checked) => updateField("isHolePlugged", checked)}
                    />
                    <Label htmlFor="isHolePlugged" className="font-normal">
                      Hole Plugged
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isCemented"
                      checked={formData.isCemented}
                      onCheckedChange={(checked) => updateField("isCemented", checked)}
                    />
                    <Label htmlFor="isCemented" className="font-normal">
                      Cemented
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="objectInHole"
                      checked={formData.objectInHole}
                      onCheckedChange={(checked) => updateField("objectInHole", checked)}
                    />
                    <Label htmlFor="objectInHole" className="font-normal">
                      Object in Hole
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => updateField("verified", checked)}
                    />
                    <Label htmlFor="verified" className="font-normal">
                      Verified
                    </Label>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="orientationMark">Orientation Mark</Label>
                  <Input
                    id="orientationMark"
                    value={formData.orientationMark}
                    onChange={(e) => updateField("orientationMark", e.target.value)}
                    placeholder="At 50m, 100m, 150m"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Geology */}
        {activeTab === 2 && (
          <div className="space-y-6">
            {/* Section 1: Geological Context */}
            <Card>
              <CardHeader>
                <CardTitle>Geological Context</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="drillPurpose">
                    Drill Purpose <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.drillPurpose} onValueChange={(value) => updateField("drillPurpose", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Exploration">Exploration</SelectItem>
                      <SelectItem value="Ore Body Definition">Ore Body Definition</SelectItem>
                      <SelectItem value="Grade Control">Grade Control</SelectItem>
                      <SelectItem value="Hydrogeological">Hydrogeological</SelectItem>
                      <SelectItem value="Geotechnical">Geotechnical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="domainCode">Domain Code</Label>
                  <Select value={formData.domainCode} onValueChange={(value) => updateField("domainCode", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZONE-A">ZONE-A</SelectItem>
                      <SelectItem value="ZONE-B">ZONE-B</SelectItem>
                      <SelectItem value="ZONE-C">ZONE-C</SelectItem>
                      <SelectItem value="DOMAIN-1">DOMAIN-1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="landUse">Land Use</Label>
                  <Select value={formData.landUse} onValueChange={(value) => updateField("landUse", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Land Use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Exploration License">Exploration License</SelectItem>
                      <SelectItem value="Mining Lease">Mining Lease</SelectItem>
                      <SelectItem value="Rehabilitation Area">Rehabilitation Area</SelectItem>
                      <SelectItem value="Restricted Zone">Restricted Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="miningLevel">Mining Level</Label>
                  <Select value={formData.miningLevel} onValueChange={(value) => updateField("miningLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Level 150">Level 150</SelectItem>
                      <SelectItem value="Level 200">Level 200</SelectItem>
                      <SelectItem value="Level 300">Level 300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="crosscut">Crosscut</Label>
                  <Select value={formData.crosscut} onValueChange={(value) => updateField("crosscut", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Crosscut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Crosscut 1">Crosscut 1</SelectItem>
                      <SelectItem value="Crosscut 2">Crosscut 2</SelectItem>
                      <SelectItem value="Main Crosscut">Main Crosscut</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subLevel">Sub Level</Label>
                  <Select value={formData.subLevel} onValueChange={(value) => updateField("subLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sub 400">Sub 400</SelectItem>
                      <SelectItem value="Sub 450">Sub 450</SelectItem>
                      <SelectItem value="Sub 500">Sub 500</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Comments */}
            <Card>
              <CardHeader>
                <CardTitle>General Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.comments}
                  onChange={(e) => updateField("comments", e.target.value)}
                  placeholder="Core recovered 98%. Slight deviation after 180m."
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 4: QA/QC */}
        {activeTab === 3 && (
          <div className="space-y-6">
            {/* Section 1: Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="confCol">Collar</Label>
                  <Select value={formData.confCol} onValueChange={(value) => updateField("confCol", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="OK">OK</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="confSur">Survey</Label>
                  <Select value={formData.confSur} onValueChange={(value) => updateField("confSur", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="OK">OK</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="confMin">Mineralogy</Label>
                  <Select value={formData.confMin} onValueChange={(value) => updateField("confMin", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="OK">OK</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="confLit">Lithology</Label>
                  <Select value={formData.confLit} onValueChange={(value) => updateField("confLit", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="OK">OK</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="confAss">Assay</Label>
                  <Select value={formData.confAss} onValueChange={(value) => updateField("confAss", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="OK">OK</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="confRec">Recovery</Label>
                  <Select value={formData.confRec} onValueChange={(value) => updateField("confRec", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="OK">OK</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: CAE Comments */}
            <Card>
              <CardHeader>
                <CardTitle>CAE/QA Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.caeComments}
                  onChange={(e) => updateField("caeComments", e.target.value)}
                  placeholder="Hole logged and verified. All QA/QC passed."
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t text-foreground">
          <Button
            variant="outline"
            onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
            disabled={activeTab === 0}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {activeTab < tabs.length - 1 ? (
              <Button onClick={() => setActiveTab((prev) => Math.min(tabs.length - 1, prev + 1))}>Next</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button onClick={handleCreateHole}>Create Hole</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
