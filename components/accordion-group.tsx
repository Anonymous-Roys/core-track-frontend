"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, CheckCircle2, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface AccordionRow {
    id: string
    hole: string
    from: string | number
    to: string | number
    date: string
}

interface AccordionGroupProps {
    id: string
    title: string
    depthLabel?: string
    depthValue?: string
    angleLabel?: string
    angleValue?: string
    progress?: number // 0..1
    rows?: AccordionRow[]
    onEditRow?: (rowId: string) => void
    onDeleteRow?: (rowId: string) => void
    onAddRow?: () => void
    defaultOpen?: boolean
}

export function AccordionGroup({
    id,
    title,
    depthLabel = "Depth",
    depthValue,
    angleLabel = "Angle",
    angleValue,
    progress = 0,
    rows = [],
    onEditRow,
    onDeleteRow,
    onAddRow,
    defaultOpen = false,
}: AccordionGroupProps) {
    const [open, setOpen] = useState(defaultOpen)

    const percent = Math.max(0, Math.min(100, Math.round(progress * 100)))

    return (
        <section
            aria-labelledby={`accordion-${id}`}
            className="bg-white rounded-xl shadow-sm px-3 py-3 mb-2 transition-all duration-200 border"
        >
            {/* Header */}
            <div className="flex items-center gap-2 select-none">
                <button
                    aria-label={open ? "Collapse" : "Expand"}
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center justify-center h-6 w-6 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                    {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
                <h3 id={`accordion-${id}`} className="font-semibold text-sm text-gray-800">
                    {title}
                </h3>
            </div>

            {/* Collapsed content (summary) always visible */}
            <div className="mt-2">
                <div className="flex items-center justify-between text-[13px] text-gray-600">
                    <div className="flex items-center gap-6">
                        {depthValue && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">{depthLabel}</span>
                                <span className="font-medium text-gray-800">{depthValue}</span>
                            </div>
                        )}
                        {angleValue && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">{angleLabel}</span>
                                <span className="font-medium text-gray-800">{angleValue}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-40 h-2 rounded bg-gray-200 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-[width] duration-300"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        {percent >= 100 && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-label="Completed" />)
                        }
                    </div>
                </div>
            </div>

            {/* Expanded table */}
            {open && (
                <div className="mt-3 overflow-x-auto animate-in fade-in duration-200">
                    <table className="w-full text-[13px] text-gray-700">
                        <thead>
                            <tr className="text-left border-b bg-gray-50">
                                <th className="px-3 py-2 w-[20%]">Hole ID</th>
                                <th className="px-3 py-2 w-[15%]">From (m)</th>
                                <th className="px-3 py-2 w-[15%]">To (m)</th>
                                <th className="px-3 py-2 w-[20%]">Date</th>
                                <th className="px-3 py-2 w-[20%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id} className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-2 font-medium">{row.hole}</td>
                                    <td className="px-3 py-2">{row.from}</td>
                                    <td className="px-3 py-2">{row.to}</td>
                                    <td className="px-3 py-2">{row.date}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onEditRow && onEditRow(row.id)}
                                                className="h-8 px-2"
                                                aria-label="Edit entry"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDeleteRow && onDeleteRow(row.id)}
                                                className="h-8 px-2 text-red-600 hover:text-red-700"
                                                aria-label="Delete entry"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                                        No rows yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddRow && onAddRow()}
                            className="border-dashed"
                        >
                            + Add Row
                        </Button>
                    </div>
                </div>
            )}
        </section>
    )
}

export default AccordionGroup


