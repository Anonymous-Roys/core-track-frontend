"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, Camera, FileText, Beaker, Layers } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface LogEntry {
  id: string
  depth_from: number
  depth_to: number
  // Lithology & Texture
  lithology: string
  sub_lithology: string
  colour: string
  texture: string
  grain_size: string
  sorting: string
  // Structure & Fabric
  structure: string
  fabric: string
  clasts: string
  phenocrysts: string
  // Alteration & Mineralisation
  alteration_type: string
  alteration_intensity: string
  mineralisation: string
  sulphides: string
  sulphide_percent: number
  oxidation_state: string
  // Veins & Weathering
  vein_type: string
  vein_density: string
  vein_orientation: string
  mineral_association: string
  weathering: string
  regolith_type: string
  colour_weathered: string
  depth_to_fresh: number
  // Notes
  notes: string
  // Depth Strat fields
  strat_litho: string
  strat_weathering: string
  strat_sedimentology: string
  strat_non_sedimentary: string
  strat_note: string
  // Depth Vein fields
  vein_structure_type: string
  vein_texture_field: string
  vein_infill_comp: string
  structure_alpha: string
  structure_beta: string
  geometry_kinematics: string
  // Depth Mineral fields
  mineral_abundance: string
  mineral_type_field: string
  mineralisation_style: string
  // Depth Alteration fields
  depth_alt_intensity: string
  depth_alt_type: string
  depth_alt_style: string
  depth_alt_colour: string
  depth_alt_colour_tone: string
  depth_alt_note: string
  // Depth Conglomerate fields
  conglomerate_matrix_package: string
  conglomerate_from: number
  conglomerate_to: number
  conglomerate_litho_subunit: string
  clast_packing: string
  clast_composition: string
  clast_sorting: string
  clast_rounding: string
  clast_sphericity: string
  clast_size_max: string
  pebble_size: string
  conglomerate_grain_size: string
  conglomerate_colour: string
  maturity: string
  fining: string
  grain_shape: string
  conglomerate_texture: string
}

interface LoggingTableProps {
  projectId: string
  holeId: string
  section: string
}

const lithologyOptions = [
  "Granite",
  "Shale",
  "Sandstone",
  "Limestone",
  "Basalt",
  "Gneiss",
  "Schist",
  "Quartzite",
  "Dolerite",
  "Andesite",
]
const subLithologyOptions = ["Coarse-grained", "Fine-grained", "Porphyritic", "Vesicular", "Foliated", "Massive"]
const colourOptions = ["Gray", "Brown", "Red", "Green", "Black", "White", "Yellow", "Pink", "Orange", "Purple"]
const textureOptions = ["Massive", "Foliated", "Banded", "Brecciated", "Vesicular", "Porphyritic"]
const grainSizeOptions = ["Very Fine", "Fine", "Medium", "Coarse", "Very Coarse"]
const sortingOptions = ["Well Sorted", "Moderately Sorted", "Poorly Sorted"]

const structureOptions = ["Massive", "Foliated", "Bedded", "Jointed", "Fractured", "Brecciated"]
const fabricOptions = ["Isotropic", "Anisotropic", "Lineated", "Foliated"]
const clastsOptions = ["None", "Rare", "Common", "Abundant"]
const phenocrystsOptions = ["None", "Rare", "Common", "Abundant"]

const alterationTypeOptions = ["Chloritic", "Sericitic", "Argillic", "Propylitic", "Potassic", "Silicic", "Carbonate"]
const alterationIntensityOptions = ["Weak", "Moderate", "Strong", "Intense", "Pervasive"]
const mineralisationOptions = ["None", "Disseminated", "Veinlet", "Massive", "Stockwork"]
const sulphidesOptions = ["Pyrite", "Chalcopyrite", "Galena", "Sphalerite", "Arsenopyrite", "Pyrrhotite"]
const oxidationStateOptions = [
  "Fresh",
  "Slightly Oxidised",
  "Moderately Oxidised",
  "Highly Oxidised",
  "Completely Oxidised",
]

const veinTypeOptions = ["Quartz", "Calcite", "Quartz-Carbonate", "Sulphide", "Oxide"]
const veinDensityOptions = ["None", "Rare", "Common", "Abundant", "Stockwork"]
const veinOrientationOptions = ["Parallel", "Perpendicular", "Oblique", "Random"]
const mineralAssociationOptions = ["Quartz", "Feldspar", "Mica", "Chlorite", "Epidote", "Calcite"]
const weatheringOptions = [
  "Fresh",
  "Slightly Weathered",
  "Moderately Weathered",
  "Highly Weathered",
  "Completely Weathered",
]
const regolithTypeOptions = ["Bedrock", "Saprolite", "Saprock", "Transported", "Colluvium"]

// Depth Strat options
const stratLithoOptions = [
  "Granite",
  "Conglomerate",
  "Sandstone",
  "Mudstone",
  "Siltstone",
  "Shale",
  "Limestone",
  "Dolomite",
  "Basalt",
  "Andesite",
  "Rhyolite",
  "Gabbro",
  "Diorite",
  "Granodiorite",
  "Gneiss",
  "Schist",
  "Quartzite",
  "Marble",
  "Slate",
  "Phyllite",
]

const stratWeatheringOptions = [
  "Fresh",
  "Slightly Weathered",
  "Moderately Weathered",
  "Highly Weathered",
  "Completely Weathered",
  "Residual Soil",
]

const stratSedimentologyOptions = [
  "Massive",
  "Bedded",
  "Laminated",
  "Cross-bedded",
  "Graded",
  "Ripple marks",
  "Mud cracks",
]

const stratNonSedimentaryOptions = [
  "Massive",
  "Foliated",
  "Porphyritic",
  "Vesicular",
  "Amygdaloidal",
  "Brecciated",
  "Mylonitic",
]

// Depth Vein options
const veinStructureTypeOptions = [
  "Quartz vein",
  "Calcite vein",
  "Quartz-carbonate",
  "Sulphide vein",
  "Oxide vein",
  "Epidote vein",
  "Chlorite vein",
  "Tension gash",
  "Shear vein",
  "Stockwork",
  "Breccia",
]

const veinTextureOptions = [
  "Massive",
  "Banded",
  "Vuggy",
  "Comb texture",
  "Cockade",
  "Colloform",
  "Crustiform",
  "Saccharoidal",
]

const veinInfillCompOptions = [
  "Quartz",
  "Calcite",
  "Dolomite",
  "Chlorite",
  "Epidote",
  "Pyrite",
  "Chalcopyrite",
  "Galena",
  "Sphalerite",
  "Hematite",
  "Goethite",
]

const structureAlphaOptions = ["0-15", "15-30", "30-45", "45-60", "60-75", "75-90"]
const structureBetaOptions = ["0-45", "45-90", "90-135", "135-180", "180-225", "225-270", "270-315", "315-360"]

const geometryKinematicsOptions = [
  "Normal",
  "Reverse",
  "Strike-slip",
  "Oblique",
  "Tension",
  "Shear",
  "Extension",
  "Compression",
]

// Depth Mineral options
const mineralAbundanceOptions = [
  "Trace (<1%)",
  "Minor (1-5%)",
  "Moderate (5-20%)",
  "Common (20-40%)",
  "Abundant (40-60%)",
  "Dominant (>60%)",
]

const mineralTypeOptions = [
  "Quartz",
  "Feldspar",
  "Mica",
  "Chlorite",
  "Epidote",
  "Calcite",
  "Dolomite",
  "Pyrite",
  "Chalcopyrite",
  "Galena",
  "Sphalerite",
  "Magnetite",
  "Hematite",
  "Goethite",
  "Malachite",
  "Azurite",
  "Gold",
  "Silver",
  "Copper",
]

const mineralisationStyleOptions = [
  "Disseminated",
  "Veinlet",
  "Massive",
  "Stockwork",
  "Breccia-hosted",
  "Replacement",
  "Skarn",
  "Porphyry",
  "Epithermal",
  "Orogenic",
  "VMS",
  "SEDEX",
  "MVT",
]

// Depth Alteration options
const depthAltIntensityOptions = ["Weak", "Weak-Moderate", "Moderate", "Moderate-Strong", "Strong", "Pervasive"]

const depthAltTypeOptions = [
  "Chloritic",
  "Sericitic",
  "Argillic",
  "Advanced Argillic",
  "Propylitic",
  "Potassic",
  "Sodic",
  "Silicic",
  "Carbonate",
  "Hematitic",
  "Epidote",
  "Biotite",
  "Tourmaline",
]

const depthAltStyleOptions = [
  "Pervasive",
  "Selective",
  "Vein-controlled",
  "Fracture-controlled",
  "Disseminated",
  "Patchy",
  "Zoned",
  "Overprinting",
]

const depthAltColourOptions = [
  "White",
  "Gray",
  "Light Gray",
  "Dark Gray",
  "Black",
  "Red",
  "Pink",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Brown",
  "Purple",
]

const depthAltColourToneOptions = ["Light", "Medium", "Dark", "Very Dark", "Pale", "Bright", "Dull"]

// Depth Conglomerate options
const conglomerateMatrixPackageOptions = [
  "Matrix-supported",
  "Clast-supported",
  "Mixed support",
  "Framework",
  "Floating clasts",
]

const conglomerateLithoSubunitOptions = [
  "Granite",
  "Basalt",
  "Sandstone",
  "Limestone",
  "Quartzite",
  "Chert",
  "Volcanic",
  "Metamorphic",
  "Sedimentary",
]

const clastPackingOptions = ["Loose", "Moderate", "Tight", "Very Tight", "Imbricated"]

const clastCompositionOptions = [
  "Monomict",
  "Polymict",
  "Granite clasts",
  "Basalt clasts",
  "Quartzite clasts",
  "Limestone clasts",
  "Chert clasts",
  "Mixed lithology",
]

const clastSortingOptions = [
  "Very Well Sorted",
  "Well Sorted",
  "Moderately Sorted",
  "Poorly Sorted",
  "Very Poorly Sorted",
]

const clastRoundingOptions = ["Angular", "Sub-angular", "Sub-rounded", "Rounded", "Well Rounded"]

const clastSphericityOptions = ["Low", "Moderate", "High", "Very High"]

const clastSizeMaxOptions = [
  "Granule (2-4mm)",
  "Pebble (4-64mm)",
  "Cobble (64-256mm)",
  "Boulder (>256mm)",
  "Small pebble",
  "Medium pebble",
  "Large pebble",
]

const pebbleSizeOptions = ["Fine (4-8mm)", "Medium (8-16mm)", "Coarse (16-32mm)", "Very Coarse (32-64mm)"]

const conglomerateGrainSizeOptions = [
  "Clay",
  "Silt",
  "Very Fine Sand",
  "Fine Sand",
  "Medium Sand",
  "Coarse Sand",
  "Very Coarse Sand",
  "Granule",
]

const maturityOptions = ["Immature", "Submature", "Mature", "Supermature"]

const finingOptions = ["Fining upward", "Coarsening upward", "Uniform", "Irregular"]

const grainShapeOptions = [
  "Angular",
  "Sub-angular",
  "Sub-rounded",
  "Rounded",
  "Well Rounded",
  "Spherical",
  "Elongate",
  "Platy",
]

const conglomerateTextureOptions = [
  "Massive",
  "Bedded",
  "Graded",
  "Cross-bedded",
  "Imbricated",
  "Chaotic",
  "Stratified",
]

export function LoggingTable({ projectId, holeId, section }: LoggingTableProps) {
  const { toast } = useToast()
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      depth_from: 0,
      depth_to: 2,
      lithology: "Granite",
      sub_lithology: "",
      colour: "Gray",
      texture: "",
      grain_size: "",
      sorting: "",
      structure: "",
      fabric: "",
      clasts: "",
      phenocrysts: "",
      alteration_type: "",
      alteration_intensity: "",
      mineralisation: "",
      sulphides: "",
      sulphide_percent: 0,
      oxidation_state: "",
      vein_type: "",
      vein_density: "",
      vein_orientation: "",
      mineral_association: "",
      weathering: "",
      regolith_type: "",
      colour_weathered: "",
      depth_to_fresh: 0,
      notes: "",
      // New fields
      strat_litho: "",
      strat_weathering: "",
      strat_sedimentology: "",
      strat_non_sedimentary: "",
      strat_note: "",
      vein_structure_type: "",
      vein_texture_field: "",
      vein_infill_comp: "",
      structure_alpha: "",
      structure_beta: "",
      geometry_kinematics: "",
      mineral_abundance: "",
      mineral_type_field: "",
      mineralisation_style: "",
      depth_alt_intensity: "",
      depth_alt_type: "",
      depth_alt_style: "",
      depth_alt_colour: "",
      depth_alt_colour_tone: "",
      depth_alt_note: "",
      conglomerate_matrix_package: "",
      conglomerate_from: 0,
      conglomerate_to: 0,
      conglomerate_litho_subunit: "",
      clast_packing: "",
      clast_composition: "",
      clast_sorting: "",
      clast_rounding: "",
      clast_sphericity: "",
      clast_size_max: "",
      pebble_size: "",
      conglomerate_grain_size: "",
      conglomerate_colour: "",
      maturity: "",
      fining: "",
      grain_shape: "",
      conglomerate_texture: "",
    },
  ])

  useEffect(() => {
    // Auto-save functionality
    if (!projectId || !holeId) return

    const autoSaveInterval = setInterval(() => {
      // Simulate auto-save
      console.log("[v0] Auto-saving logs...", logs)
    }, 3000)

    return () => clearInterval(autoSaveInterval)
  }, [logs, projectId, holeId])

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        handleSave()
      } else if (e.ctrlKey && e.key === "n") {
        e.preventDefault()
        handleAddRow()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [logs])

  const handleAddRow = () => {
    const lastLog = logs[logs.length - 1]
    const newDepthFrom = lastLog ? lastLog.depth_to : 0

    const newLog: LogEntry = {
      id: Date.now().toString(),
      depth_from: newDepthFrom,
      depth_to: newDepthFrom + 1,
      lithology: "",
      sub_lithology: "",
      colour: "",
      texture: "",
      grain_size: "",
      sorting: "",
      structure: "",
      fabric: "",
      clasts: "",
      phenocrysts: "",
      alteration_type: "",
      alteration_intensity: "",
      mineralisation: "",
      sulphides: "",
      sulphide_percent: 0,
      oxidation_state: "",
      vein_type: "",
      vein_density: "",
      vein_orientation: "",
      mineral_association: "",
      weathering: "",
      regolith_type: "",
      colour_weathered: "",
      depth_to_fresh: 0,
      notes: "",
      // New fields
      strat_litho: "",
      strat_weathering: "",
      strat_sedimentology: "",
      strat_non_sedimentary: "",
      strat_note: "",
      vein_structure_type: "",
      vein_texture_field: "",
      vein_infill_comp: "",
      structure_alpha: "",
      structure_beta: "",
      geometry_kinematics: "",
      mineral_abundance: "",
      mineral_type_field: "",
      mineralisation_style: "",
      depth_alt_intensity: "",
      depth_alt_type: "",
      depth_alt_style: "",
      depth_alt_colour: "",
      depth_alt_colour_tone: "",
      depth_alt_note: "",
      conglomerate_matrix_package: "",
      conglomerate_from: 0,
      conglomerate_to: 0,
      conglomerate_litho_subunit: "",
      clast_packing: "",
      clast_composition: "",
      clast_sorting: "",
      clast_rounding: "",
      clast_sphericity: "",
      clast_size_max: "",
      pebble_size: "",
      conglomerate_grain_size: "",
      conglomerate_colour: "",
      maturity: "",
      fining: "",
      grain_shape: "",
      conglomerate_texture: "",
    }

    setLogs([...logs, newLog])
    toast({
      title: "Row added",
      description: "New logging interval created",
    })
  }

  const handleDeleteRow = (id: string) => {
    setLogs(logs.filter((log) => log.id !== id))
    toast({
      title: "Row deleted",
      description: "Logging interval removed",
      variant: "destructive",
    })
  }

  const handleUpdateLog = (id: string, field: keyof LogEntry, value: string | number) => {
    setLogs(
      logs.map((log) => {
        if (log.id === id) {
          const updatedLog = { ...log, [field]: value }

          // Validation
          if (field === "depth_from" || field === "depth_to") {
            const numValue = Number(value)
            if (numValue < 0) {
              toast({
                title: "Validation error",
                description: "Depth must be a positive number",
                variant: "destructive",
              })
              return log
            }
          }

          if (field === "depth_to" && Number(value) <= updatedLog.depth_from) {
            toast({
              title: "Validation error",
              description: "Depth To must be greater than Depth From",
              variant: "destructive",
            })
            return log
          }

          return updatedLog
        }
        return log
      }),
    )
  }

  const handleSave = () => {
    toast({
      title: "Log saved successfully",
      description: `Saved ${logs.length} intervals for ${section}`,
    })
  }

  if (!projectId || !holeId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 opacity-90">
            <Image src="/placeholder.svg" alt="" fill className="object-contain" priority />
          </div>
          <div className="mt-4 flex items-center gap-3 text-muted-foreground">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <Layers className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <Camera className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <FileText className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <Beaker className="h-5 w-5" />
            </div>
          </div>
          <span className="sr-only">Select a project and hole to begin</span>
        </div>
      </div>
    )
  }

  const renderTableContent = () => {
    switch (section) {
      case "Lithology":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Lithology</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Sub-Lithology</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Colour</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Texture</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Grain Size</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Sorting</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isLargeInterval = log.depth_to - log.depth_from > 5
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_from}
                        onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.lithology}
                        onValueChange={(value) => handleUpdateLog(log.id, "lithology", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {lithologyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.sub_lithology}
                        onValueChange={(value) => handleUpdateLog(log.id, "sub_lithology", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {subLithologyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select value={log.colour} onValueChange={(value) => handleUpdateLog(log.id, "colour", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {colourOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select value={log.texture} onValueChange={(value) => handleUpdateLog(log.id, "texture", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {textureOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.grain_size}
                        onValueChange={(value) => handleUpdateLog(log.id, "grain_size", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {grainSizeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select value={log.sorting} onValueChange={(value) => handleUpdateLog(log.id, "sorting", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortingOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )

      case "Structure":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-48">Structure</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-48">Fabric</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-48">Clasts</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-48">Phenocrysts</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isLargeInterval = log.depth_to - log.depth_from > 5
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_from}
                        onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.structure}
                        onValueChange={(value) => handleUpdateLog(log.id, "structure", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {structureOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select value={log.fabric} onValueChange={(value) => handleUpdateLog(log.id, "fabric", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {fabricOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select value={log.clasts} onValueChange={(value) => handleUpdateLog(log.id, "clasts", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {clastsOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.phenocrysts}
                        onValueChange={(value) => handleUpdateLog(log.id, "phenocrysts", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {phenocrystsOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )

      case "Alteration":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Alteration Type</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Intensity</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Mineralisation</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Sulphides</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Sulphide %</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Oxidation State</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isLargeInterval = log.depth_to - log.depth_from > 5
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_from}
                        onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.alteration_type}
                        onValueChange={(value) => handleUpdateLog(log.id, "alteration_type", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {alterationTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.alteration_intensity}
                        onValueChange={(value) => handleUpdateLog(log.id, "alteration_intensity", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {alterationIntensityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.mineralisation}
                        onValueChange={(value) => handleUpdateLog(log.id, "mineralisation", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mineralisationOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.sulphides}
                        onValueChange={(value) => handleUpdateLog(log.id, "sulphides", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {sulphidesOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-2">
                        <Slider
                          value={[log.sulphide_percent]}
                          onValueChange={(value) => handleUpdateLog(log.id, "sulphide_percent", value[0])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <span className="text-xs text-center text-gray-600">{log.sulphide_percent}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.oxidation_state}
                        onValueChange={(value) => handleUpdateLog(log.id, "oxidation_state", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {oxidationStateOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )

      case "Samples":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Vein Type</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Vein Density</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Vein Orientation</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Mineral Association</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Weathering</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Regolith Type</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Colour (Weathered)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth to Fresh</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isLargeInterval = log.depth_to - log.depth_from > 5
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_from}
                        onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.vein_type}
                        onValueChange={(value) => handleUpdateLog(log.id, "vein_type", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {veinTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.vein_density}
                        onValueChange={(value) => handleUpdateLog(log.id, "vein_density", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {veinDensityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.vein_orientation}
                        onValueChange={(value) => handleUpdateLog(log.id, "vein_orientation", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {veinOrientationOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.mineral_association}
                        onValueChange={(value) => handleUpdateLog(log.id, "mineral_association", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mineralAssociationOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.weathering}
                        onValueChange={(value) => handleUpdateLog(log.id, "weathering", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {weatheringOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.regolith_type}
                        onValueChange={(value) => handleUpdateLog(log.id, "regolith_type", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {regolithTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.colour_weathered}
                        onValueChange={(value) => handleUpdateLog(log.id, "colour_weathered", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {colourOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to_fresh}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to_fresh", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )

      case "Photos":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Quick Log Notes</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isLargeInterval = log.depth_to - log.depth_from > 5
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_from}
                        onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Textarea
                        value={log.notes}
                        onChange={(e) => handleUpdateLog(log.id, "notes", e.target.value)}
                        placeholder="Enter notes for this interval..."
                        className="w-full min-h-[80px] resize-y"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )

      case "Depth Strat":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Litho</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Weathering</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Sedimentology</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Non-Sedimentary</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-64">Note</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isLargeInterval = log.depth_to - log.depth_from > 5
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_from}
                        onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.strat_litho}
                        onValueChange={(value) => handleUpdateLog(log.id, "strat_litho", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {stratLithoOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.strat_weathering}
                        onValueChange={(value) => handleUpdateLog(log.id, "strat_weathering", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {stratWeatheringOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.strat_sedimentology}
                        onValueChange={(value) => handleUpdateLog(log.id, "strat_sedimentology", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {stratSedimentologyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.strat_non_sedimentary}
                        onValueChange={(value) => handleUpdateLog(log.id, "strat_non_sedimentary", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {stratNonSedimentaryOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={log.strat_note}
                        onChange={(e) => handleUpdateLog(log.id, "strat_note", e.target.value)}
                        placeholder="Notes..."
                        className="w-full"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )

      case "Depth Vein":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Structure/Type</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Vein Texture</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Vein Infill/Comp</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Structure @ α</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">β</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">
                  Geometry & Kinematics
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isLargeInterval = log.depth_to - log.depth_from > 5
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_from}
                        onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.vein_structure_type}
                        onValueChange={(value) => handleUpdateLog(log.id, "vein_structure_type", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {veinStructureTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.vein_texture_field}
                        onValueChange={(value) => handleUpdateLog(log.id, "vein_texture_field", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {veinTextureOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.vein_infill_comp}
                        onValueChange={(value) => handleUpdateLog(log.id, "vein_infill_comp", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {veinInfillCompOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.structure_alpha}
                        onValueChange={(value) => handleUpdateLog(log.id, "structure_alpha", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {structureAlphaOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.structure_beta}
                        onValueChange={(value) => handleUpdateLog(log.id, "structure_beta", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {structureBetaOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.geometry_kinematics}
                        onValueChange={(value) => handleUpdateLog(log.id, "geometry_kinematics", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {geometryKinematicsOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )

      case "Depth Mineral":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-48">Abundance</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-48">Mineral Type</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-48">Mineralisation Style</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isLargeInterval = log.depth_to - log.depth_from > 5
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_from}
                        onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.mineral_abundance}
                        onValueChange={(value) => handleUpdateLog(log.id, "mineral_abundance", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mineralAbundanceOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.mineral_type_field}
                        onValueChange={(value) => handleUpdateLog(log.id, "mineral_type_field", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mineralTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.mineralisation_style}
                        onValueChange={(value) => handleUpdateLog(log.id, "mineralisation_style", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mineralisationStyleOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )

      case "Depth Alteration":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Intensity</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Alteration Type</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Alteration Style</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Colour</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Colour Tone</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-64">Note</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isLargeInterval = log.depth_to - log.depth_from > 5
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_from}
                        onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={log.depth_to}
                        onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                        className="text-center w-full"
                        step="0.1"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.depth_alt_intensity}
                        onValueChange={(value) => handleUpdateLog(log.id, "depth_alt_intensity", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {depthAltIntensityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.depth_alt_type}
                        onValueChange={(value) => handleUpdateLog(log.id, "depth_alt_type", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {depthAltTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.depth_alt_style}
                        onValueChange={(value) => handleUpdateLog(log.id, "depth_alt_style", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {depthAltStyleOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.depth_alt_colour}
                        onValueChange={(value) => handleUpdateLog(log.id, "depth_alt_colour", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {depthAltColourOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Select
                        value={log.depth_alt_colour_tone}
                        onValueChange={(value) => handleUpdateLog(log.id, "depth_alt_colour_tone", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {depthAltColourToneOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={log.depth_alt_note}
                        onChange={(e) => handleUpdateLog(log.id, "depth_alt_note", e.target.value)}
                        placeholder="Notes..."
                        className="w-full"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )

      case "Depth Conglomerate":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth From (m)</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-32">Depth To (m)</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Matrix Package</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Litho Sub-unit</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Clast Packing</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Composition</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Clast Sorting</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Clast Rounding</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Clast Sphericity</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Clast Size Max</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Pebble Size</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Grain Size</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Colour</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Maturity</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Fining</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Grain Shape</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-40">Texture</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const isLargeInterval = log.depth_to - log.depth_from > 5
                  return (
                    <tr
                      key={log.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isLargeInterval ? "bg-amber-50" : ""
                        }`}
                    >
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={log.depth_from}
                          onChange={(e) => handleUpdateLog(log.id, "depth_from", Number(e.target.value))}
                          className="text-center w-full"
                          step="0.1"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          value={log.depth_to}
                          onChange={(e) => handleUpdateLog(log.id, "depth_to", Number(e.target.value))}
                          className="text-center w-full"
                          step="0.1"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.conglomerate_matrix_package}
                          onValueChange={(value) => handleUpdateLog(log.id, "conglomerate_matrix_package", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {conglomerateMatrixPackageOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.conglomerate_litho_subunit}
                          onValueChange={(value) => handleUpdateLog(log.id, "conglomerate_litho_subunit", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {conglomerateLithoSubunitOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.clast_packing}
                          onValueChange={(value) => handleUpdateLog(log.id, "clast_packing", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {clastPackingOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.clast_composition}
                          onValueChange={(value) => handleUpdateLog(log.id, "clast_composition", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {clastCompositionOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.clast_sorting}
                          onValueChange={(value) => handleUpdateLog(log.id, "clast_sorting", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {clastSortingOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.clast_rounding}
                          onValueChange={(value) => handleUpdateLog(log.id, "clast_rounding", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {clastRoundingOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.clast_sphericity}
                          onValueChange={(value) => handleUpdateLog(log.id, "clast_sphericity", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {clastSphericityOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.clast_size_max}
                          onValueChange={(value) => handleUpdateLog(log.id, "clast_size_max", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {clastSizeMaxOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.pebble_size}
                          onValueChange={(value) => handleUpdateLog(log.id, "pebble_size", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {pebbleSizeOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.conglomerate_grain_size}
                          onValueChange={(value) => handleUpdateLog(log.id, "conglomerate_grain_size", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {conglomerateGrainSizeOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.conglomerate_colour}
                          onValueChange={(value) => handleUpdateLog(log.id, "conglomerate_colour", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {colourOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.maturity}
                          onValueChange={(value) => handleUpdateLog(log.id, "maturity", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {maturityOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select value={log.fining} onValueChange={(value) => handleUpdateLog(log.id, "fining", value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {finingOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.grain_shape}
                          onValueChange={(value) => handleUpdateLog(log.id, "grain_shape", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {grainShapeOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={log.conglomerate_texture}
                          onValueChange={(value) => handleUpdateLog(log.id, "conglomerate_texture", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {conglomerateTextureOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(log.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{section} Logging</h2>
          <div className="flex gap-2">
            <Button className="text-background" onClick={handleAddRow} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Row
            </Button>
            <Button onClick={handleSave} size="sm" variant="outline">
              Save (Ctrl+S)
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">{renderTableContent()}</div>

        {logs.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <p>No logging data yet. Click "Add Row" to start logging.</p>
          </div>
        )}
      </div>
    </div>
  )
}
