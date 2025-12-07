import { useState, useEffect } from "react";
import { gpuData as staticData, getTimeSinceUpdate, updateDataTimestamp, mergeWithFetchedPrices } from "@/lib/data";
import { GPU } from "@/types";
import { ScrapedGPU } from "@/lib/price-fetcher";

export function useGPUPrices(initialData?: ScrapedGPU[]) {
    const [data, setData] = useState<GPU[]>(() => {
        if (initialData && initialData.length > 0) {
            return mergeWithFetchedPrices(initialData);
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
                    setData(mergeWithFetchedPrices(result.data));
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
