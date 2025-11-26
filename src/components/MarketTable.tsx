"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Assuming shadcn components
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockGPUs as staticData } from "@/lib/data";
import { GPU } from "@/lib/types"; // Ensure you created this in Phase 2

export function MarketTable() {
    // 1. Initialize with static data (Fast LCP)
    const [data, setData] = useState<GPU[]>(staticData);
    const [loading, setLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);

    // 2. Fetch live prices on mount
    useEffect(() => {
        async function fetchLivePrices() {
            try {
                const response = await fetch("/api/cron/refresh-prices");
                const result = await response.json();

                if (result.status === "success" && Array.isArray(result.data)) {
                    const livePrices = result.data;

                    // 3. Smart Merge Strategy
                    setData((prevData) =>
                        prevData.map((staticGpu) => {
                            // Find a match in the live data (by Model + Provider)
                            const match = livePrices.find(
                                (liveGpu: any) =>
                                    liveGpu.model.toLowerCase() === staticGpu.model.toLowerCase() &&
                                    liveGpu.provider.toLowerCase() === staticGpu.provider.toLowerCase()
                            );

                            // If match found, update price & timestamp. Else keep static.
                            if (match) {
                                return {
                                    ...staticGpu,
                                    price: match.price,
                                    lastUpdated: new Date(), // Mark as fresh
                                };
                            }
                            return staticGpu;
                        })
                    );
                    setIsLive(true);
                }
            } catch (error) {
                console.error("Failed to fetch live prices", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLivePrices();
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Live Market Data</h2>
                <div className="flex items-center gap-2">
                    {loading && <span className="text-xs text-muted-foreground animate-pulse">Syncing...</span>}
                    <Badge variant={isLive ? "default" : "secondary"} className={isLive ? "bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/50" : "bg-zinc-800 text-zinc-400"}>
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-zinc-500"}`} />
                        {isLive ? "Live Connection" : "Static Data"}
                    </Badge>
                </div>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900">
                            <TableHead className="w-[200px]">Model</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>VRAM</TableHead>
                            <TableHead className="text-right">Price / Hr</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((gpu) => (
                            <TableRow key={`${gpu.provider}-${gpu.model}`} className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell className="font-medium text-zinc-200">{gpu.model}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-700/50">
                                        {gpu.provider}
                                    </span>
                                </TableCell>
                                <TableCell className="text-zinc-400">{gpu.vram} GB</TableCell>
                                <TableCell className="text-right font-mono text-cyan-400">
                                    ${gpu.price.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
