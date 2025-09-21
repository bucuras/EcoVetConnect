"use client"

import React, { useState, useRef, useEffect, ReactNode } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

type Align = "start" | "center" | "end"

interface PortalDropdownProps {
    trigger: ReactNode
    children: ReactNode
    align?: Align
    sideOffset?: number
    className?: string
    closeOnSelect?: boolean
}

export default function PortalDropdown({
                                           trigger,
                                           children,
                                           align = "start",
                                           sideOffset = 8,
                                           className,
                                           closeOnSelect = true,
                                       }: PortalDropdownProps) {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const [coords, setCoords] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (!open) return

        function updatePosition() {
            const trig = triggerRef.current
            const cont = contentRef.current
            if (!trig) return

            const rect = trig.getBoundingClientRect()
            const scrollY = window.scrollY || window.pageYOffset
            const scrollX = window.scrollX || window.pageXOffset

            let top = rect.bottom + scrollY + sideOffset
            let left = rect.left + scrollX

            if (cont) {
                const cRect = cont.getBoundingClientRect()

                if (align === "center") {
                    left = rect.left + scrollX + rect.width / 2 - cRect.width / 2
                } else if (align === "end") {
                    left = rect.right + scrollX - cRect.width
                }

                const margin = 8
                const vw = window.innerWidth
                if (left + cRect.width > vw - margin) left = Math.max(margin, vw - cRect.width - margin)
                if (left < margin) left = margin

                const vh = window.innerHeight + scrollY
                if (top + cRect.height > vh - margin) {
                    top = rect.top + scrollY - cRect.height - sideOffset
                }
            }

            setCoords({ top, left })
        }

        updatePosition()
        const ro = new ResizeObserver(updatePosition)
        if (contentRef.current) ro.observe(contentRef.current)
        window.addEventListener("resize", updatePosition)
        window.addEventListener("scroll", updatePosition, true)

        return () => {
            ro.disconnect()
            window.removeEventListener("resize", updatePosition)
            window.removeEventListener("scroll", updatePosition, true)
        }
    }, [open, align, sideOffset])

    useEffect(() => {
        if (!open) return

        function onPointerDown(e: PointerEvent) {
            const t = e.target as Node
            if (triggerRef.current?.contains(t)) return
            if (contentRef.current?.contains(t)) return
            setOpen(false)
        }

        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false)
        }

        document.addEventListener("pointerdown", onPointerDown)
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("pointerdown", onPointerDown)
            document.removeEventListener("keydown", onKey)
        }
    }, [open])

    function onContentClick(e: React.MouseEvent) {
        if (!closeOnSelect) return
        const target = e.target as HTMLElement
        if (target.closest("[data-close='true']")) setOpen(false)
    }

    return (
        <>
            <div
                ref={triggerRef}
                onClick={(e) => {
                    e.stopPropagation()
                    setOpen((v) => !v)
                }}
                aria-haspopup="true"
                aria-expanded={open}
                className="inline-block"
            >
                {trigger}
            </div>

            {open &&
                createPortal(
                    <div
                        ref={contentRef}
                        onClick={onContentClick}
                        role="menu"
                        style={{ position: "absolute", top: coords.top, left: coords.left, zIndex: 999999 }}
                        className={cn(
                            "bg-popover text-popover-foreground rounded-md border p-1 shadow-md min-w-[12rem] max-h-[30rem] overflow-auto",
                            className,
                        )}
                    >
                        {children}
                    </div>,
                    document.body,
                )}
        </>
    )
}
