"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Camera,
    FileText,
    Beaker,
    MoreVertical,
    ChevronDown,
    ChevronRight,
} from "lucide-react"
import Link from "next/link"

interface DrillHole {
    id: string
    siteId: string
    location: string
    status: "DRILLED" | "DRILLING" | "NOT DRILLED" | "ABANDONED"
    plannedDepth: number
    drilledDepth: number
    startDate: string
    endDate: string
    statusNote: string
    hasPhoto: boolean
    hasLitho: boolean
    hasSamples: boolean
}

interface BlockModalProps {
    isOpen: boolean
    onClose: () => void
    location: string
    holes: DrillHole[]
}

export function BlockModal({ isOpen, onClose, location, holes }: BlockModalProps) {
    const [expandedHoles, setExpandedHoles] = useState<string[]>([])

    const toggleHole = (holeId: string) => {
        setExpandedHoles((prev) =>
            prev.includes(holeId) ? prev.filter((id) => id !== holeId) : [...prev, holeId]
        )
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

    // Calculate block statistics
    const blockStats = {
        total: holes.length,
        drilled: holes.filter((h) => h.status === "DRILLED").length,
        drilling: holes.filter((h) => h.status === "DRILLING").length,
        notDrilled: holes.filter((h) => h.status === "NOT DRILLED").length,
        abandoned: holes.filter((h) => h.status === "ABANDONED").length,
        totalMeters: holes
            .filter((h) => h.status === "DRILLED" || h.status === "ABANDONED")
            .reduce((sum, h) => sum + h.drilledDepth, 0),
        avgDepth: holes.length > 0
            ? holes.reduce((sum, h) => sum + h.plannedDepth, 0) / holes.length
            : 0,
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{location} Details</DialogTitle>
                    <DialogDescription>
                        Comprehensive overview of all drill holes in {location}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Block Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Holes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{blockStats.total}</div>
                                <p className="text-xs text-muted-foreground">holes planned</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Completed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{blockStats.drilled}</div>
                                <p className="text-xs text-muted-foreground">holes drilled</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    In Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{blockStats.drilling}</div>
                                <p className="text-xs text-muted-foreground">currently drilling</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Meters
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">
                                    {blockStats.totalMeters.toFixed(1)}
                                </div>
                                <p className="text-xs text-muted-foreground">meters drilled</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Drill Holes List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Drill Holes ({holes.length})</h3>

                        <div className="space-y-3">
                            {holes.map((hole) => (
                                <Card key={hole.id} className="overflow-hidden">
                                    <CardHeader
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => toggleHole(hole.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {expandedHoles.includes(hole.id) ? (
                                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                )}

                                                <div className={`h-3 w-3 rounded-full ${getStatusDot(hole.status)} flex-shrink-0`} />

                                                <div>
                                                    <div className="font-semibold text-foreground">{hole.id}</div>
                                                    <div className="text-sm text-muted-foreground">{hole.siteId}</div>
                                                </div>

                                                <Badge className={`${getStatusColor(hole.status)} border text-xs`}>
                                                    {hole.status}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`p-1.5 rounded ${hole.hasPhoto ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                                                        }`}
                                                >
                                                    <Camera className="h-4 w-4" />
                                                </div>
                                                <div
                                                    className={`p-1.5 rounded ${hole.hasLitho ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                                                        }`}
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div
                                                    className={`p-1.5 rounded ${hole.hasSamples ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                                                        }`}
                                                >
                                                    <Beaker className="h-4 w-4" />
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {expandedHoles.includes(hole.id) && (
                                        <CardContent className="pt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Planned Depth</div>
                                                    <div className="text-lg font-semibold">{hole.plannedDepth}m</div>
                                                </div>

                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Drilled Depth</div>
                                                    <div className="text-lg font-semibold">
                                                        {hole.drilledDepth > 0 ? `${hole.drilledDepth}m` : "-"}
                                                    </div>
                                                    {hole.status === "DRILLING" && hole.drilledDepth > 0 && (
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                            <div
                                                                className="bg-blue-500 h-2 rounded-full transition-all"
                                                                style={{ width: `${Math.min((hole.drilledDepth / hole.plannedDepth) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">Start Date</div>
                                                    <div className="text-lg font-semibold">{hole.startDate || "-"}</div>
                                                </div>

                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">End Date</div>
                                                    <div className="text-lg font-semibold">{hole.endDate || "-"}</div>
                                                </div>
                                            </div>

                                            {hole.statusNote && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                    <div className="text-sm font-medium text-blue-900">Status Note</div>
                                                    <div className="text-sm text-blue-700">{hole.statusNote}</div>
                                                </div>
                                            )}

                                            <div className="mt-4 flex gap-2">
                                                <Link href={`/?holeId=${hole.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                                <Button variant="outline" size="sm">
                                                    Edit Hole
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    Export Data
                                                </Button>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
