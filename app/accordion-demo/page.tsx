"use client"

import AccordionGroup, { AccordionRow } from "@/components/accordion-group"

export default function AccordionDemoPage() {
    const rows: AccordionRow[] = [
        { id: "1", hole: "123", from: "121", to: "123", date: "16/10/25" },
        { id: "2", hole: "124", from: "130", to: "138", date: "17/10/25" },
    ]

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
                <AccordionGroup
                    id="block-1"
                    title="BLOCK 1 - Example"
                    depthValue="123m"
                    angleValue="17°"
                    progress={0.7}
                    rows={rows}
                    onEditRow={(id) => console.log("edit", id)}
                    onDeleteRow={(id) => console.log("delete", id)}
                    onAddRow={() => console.log("add row")}
                    defaultOpen
                />
            </div>
        </div>
    )
}


