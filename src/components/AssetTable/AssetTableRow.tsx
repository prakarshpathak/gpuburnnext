import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { GPU } from "@/types";

interface AssetTableRowProps {
    gpu: GPU;
    pricingUnit: 'perStock' | 'perGB';
    formatPrice: (price: number, vram: number) => string;
    formatCurrency: (value: number) => string;
}

export function AssetTableRow({ gpu, pricingUnit, formatPrice, formatCurrency }: AssetTableRowProps) {
    const gpuCount = gpu.gpuCount || 1;
    const totalVram = gpu.vram * gpuCount;
    const totalPrice = gpu.price * gpuCount;

    return (
        <TableRow className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
            <TableCell className="font-medium text-gray-900 dark:text-gray-200">
                <div className="flex items-center gap-2">
                    {gpu.slug ? (
                        <a
                            href={`/gpus/${gpu.slug}`}
                            className="hover:text-green-600 dark:hover:text-green-400 hover:underline"
                        >
                            {gpu.model}
                        </a>
                    ) : (
                        <span>{gpu.model}</span>
                    )}
                    {gpu.availability === 'Unavailable' && (
                        <Badge variant="secondary" className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            Unavailable
                        </Badge>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="text-gray-700 dark:text-gray-300">{gpu.provider}</span>
                    {gpu.providerType === 'Marketplace' && (
                        <span className="text-[10px] text-amber-500 mt-0.5">Marketplace</span>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-gray-600 dark:text-gray-400">{gpuCount}</TableCell>
            <TableCell className="text-gray-600 dark:text-gray-400">{totalVram} GB</TableCell>
            <TableCell className="text-gray-600 dark:text-gray-400">
                {gpu.systemSpecs ? (
                    <div className="text-xs">
                        <div>{gpu.systemSpecs.vCPU}vCPU</div>
                        <div>{gpu.systemSpecs.ram}GB RAM</div>
                    </div>
                ) : (
                    <span>-</span>
                )}
            </TableCell>
            <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                {pricingUnit === 'perGB'
                    ? `$${formatPrice(gpu.price, gpu.vram)}`
                    : formatCurrency(gpu.price)
                }
                {pricingUnit === 'perGB' ? ' /GB/hr' : ' /GPU/hr'}
            </TableCell>
            <TableCell className="text-right font-mono text-gray-700 dark:text-gray-300">
                {formatCurrency(totalPrice)} /hr
            </TableCell>
            <TableCell className="text-right text-gray-500 dark:text-gray-500">
                {gpu.signupCredit || '—'}
            </TableCell>
            <TableCell className="text-right">
                {gpu.launchUrl && gpu.availability !== 'Unavailable' ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(gpu.launchUrl, '_blank')}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white border-green-600"
                    >
                        Launch <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                ) : (
                    <span className="text-xs text-gray-400">—</span>
                )}
            </TableCell>
        </TableRow>
    );
}
