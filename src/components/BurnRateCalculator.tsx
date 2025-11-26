"use client";

import * as React from "react";
import { mockGPUs } from "@/lib/data";
import { GPU } from "@/lib/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function BurnRateCalculator() {
    const [selectedGpuId, setSelectedGpuId] = React.useState<string>("");
    const [quantity, setQuantity] = React.useState<number>(1);
    const [hours, setHours] = React.useState<number>(730);

    const selectedGPU = mockGPUs.find((g) => g.id === selectedGpuId);

    const calculateMonthlyCost = () => {
        if (!selectedGPU) return 0;
        return selectedGPU.price * hours * quantity;
    };

    const monthlyCost = calculateMonthlyCost();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <Card className="w-full bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white">GPU Burn Rate Calculator</CardTitle>
                <CardDescription className="text-slate-400">
                    Configure your GPU usage to estimate monthly costs
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* GPU Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-200">Select GPU</label>
                    <Select onValueChange={setSelectedGpuId} value={selectedGpuId}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Choose a GPU..." />
                        </SelectTrigger>
                        <SelectContent>
                            {mockGPUs.map((gpu) => (
                                <SelectItem key={gpu.id} value={gpu.id}>
                                    {gpu.model} - {gpu.provider} ({formatCurrency(gpu.price)}/hr)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Quantity Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-slate-200">Quantity</label>
                        <span className="text-sm font-bold text-white">{quantity} GPU{quantity > 1 ? 's' : ''}</span>
                    </div>
                    <Slider
                        value={[quantity]}
                        onValueChange={(value) => setQuantity(value[0])}
                        min={1}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                </div>

                {/* Hours Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-slate-200">Hours per Month</label>
                        <span className="text-sm font-bold text-white">{hours} hrs</span>
                    </div>
                    <Slider
                        value={[hours]}
                        onValueChange={(value) => setHours(value[0])}
                        min={1}
                        max={730}
                        step={1}
                        className="w-full"
                    />
                </div>

                {/* Estimated Monthly Cost */}
                {selectedGPU && (
                    <div className="pt-6 border-t border-slate-800">
                        <div className="text-center space-y-2">
                            <p className="text-sm text-slate-400 uppercase tracking-wide">
                                Estimated Monthly Cost
                            </p>
                            <p className="text-5xl font-bold text-white">
                                {formatCurrency(monthlyCost)}
                            </p>
                            <p className="text-xs text-slate-500">
                                {quantity} × {selectedGPU.model} @ {formatCurrency(selectedGPU.price)}/hr × {hours} hrs
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
