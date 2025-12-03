import { useState, useEffect } from "react";
import { gpuData as staticData, getTimeSinceUpdate, updateDataTimestamp } from "@/lib/data";
import { GPU } from "@/types";
import { ScrapedGPU } from "@/lib/price-fetcher";

export function useGPUPrices(initialData?: ScrapedGPU[]) {
    // Helper to merge live data with static data
    const mergeData = (livePrices: ScrapedGPU[]) => {
        const updatedData = [...staticData];
        const existingMap = new Map(
            updatedData.map((item, index) => [`${item.model.toLowerCase()}-${item.provider.toLowerCase()}`, index])
        );

        livePrices.forEach((liveGpu) => {
            const key = `${liveGpu.model.toLowerCase()}-${liveGpu.provider.toLowerCase()}`;
            if (existingMap.has(key)) {
                const index = existingMap.get(key)!;
                updatedData[index] = {
                    ...updatedData[index],
                    price: liveGpu.price,
                    lastUpdated: new Date(),
                };
            } else {
                let gpuType: 'High-End' | 'Mid-Range' | 'Budget' = 'High-End';
                const modelLower = liveGpu.model.toLowerCase();
                if (modelLower.includes('3090') || modelLower.includes('4070') || modelLower.includes('a4000')) {
                    gpuType = 'Mid-Range';
                } else if (modelLower.includes('3080') || modelLower.includes('3070') || modelLower.includes('2080')) {
                    gpuType = 'Budget';
                }

                updatedData.push({
                    id: `live-${liveGpu.provider}-${liveGpu.model}-${Math.random()}`,
                    model: liveGpu.model,
                    provider: liveGpu.provider,
                    price: liveGpu.price,
                    vram: liveGpu.vram || 0,
                    type: gpuType,
                    providerType: 'Marketplace',
                    lastUpdated: new Date(),
                });
            }
        });
        return updatedData;
    };

    const [data, setData] = useState<GPU[]>(() => {
        if (initialData && initialData.length > 0) {
            return mergeData(initialData);
        }
        return staticData;
    });

    const [loading, setLoading] = useState(!initialData);
    const [isLive, setIsLive] = useState(!!initialData);
    const [lastUpdated, setLastUpdated] = useState<string>(initialData ? 'Just now' : '2 hours ago');

    useEffect(() => {
        // If we have initial data, we don't need to fetch immediately
        if (initialData) return;

        async function fetchLivePrices() {
            try {
                const response = await fetch("/api/cron/refresh-prices");
                const result = await response.json();

                if (result.status === "success" && Array.isArray(result.data)) {
                    setData(mergeData(result.data));
                    setIsLive(true);
                    updateDataTimestamp();
                    setLastUpdated(getTimeSinceUpdate());
                }
            } catch (error) {
                console.error("Failed to fetch live prices", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLivePrices();
    }, [initialData]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(getTimeSinceUpdate());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return { data, loading, isLive, lastUpdated };
}
