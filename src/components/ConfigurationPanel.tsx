"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sliders } from "lucide-react";
import { GPU } from "@/lib/types";

interface ConfigProps {
  models: string[];
  providers: string[];
  selectedModel: string;
  selectedProvider: string;
  quantity: number;
  hours: number;
  onModelChange: (val: string) => void;
  onProviderChange: (val: string) => void;
  onQtyChange: (val: number) => void;
  onHoursChange: (val: number) => void;
}

export function ConfigurationPanel({
  models, providers, selectedModel, selectedProvider, quantity, hours,
  onModelChange, onProviderChange, onQtyChange, onHoursChange
}: ConfigProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <Sliders className="w-4 h-4 text-cyan-400" /> Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* GPU Model */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">GPU Model</Label>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="border-zinc-700 bg-zinc-800/50 text-zinc-200">
              <SelectValue placeholder="Select GPU" />
            </SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900 text-zinc-200">
              {models.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Provider */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Provider</Label>
          <Select value={selectedProvider} onValueChange={onProviderChange}>
            <SelectTrigger className="border-zinc-700 bg-zinc-800/50 text-zinc-200">
              <SelectValue placeholder="Select Provider" />
            </SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900 text-zinc-200">
              {providers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t border-zinc-800/50 space-y-4">
          {/* Quantity Slider */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Quantity</Label>
              <span className="text-xs font-mono text-cyan-400">{quantity} Node{quantity > 1 ? 's' : ''}</span>
            </div>
            <Slider 
              value={[quantity]} 
              min={1} 
              max={128} 
              step={1} 
              onValueChange={(vals) => onQtyChange(vals[0])}
              className="py-2"
            />
          </div>

          {/* Hours Slider */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Usage / Day</Label>
              <span className="text-xs font-mono text-cyan-400">{hours} Hours</span>
            </div>
            <Slider 
              value={[hours]} 
              min={1} 
              max={24} 
              step={1} 
              onValueChange={(vals) => onHoursChange(vals[0])}
              className="py-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

