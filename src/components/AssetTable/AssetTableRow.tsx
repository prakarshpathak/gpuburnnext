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
    return (
        <TableRow className="border-border hover:bg-accent/50">
            <TableCell className="font-medium text-foreground">
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
                        <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground">
                            Unavailable
                        </Badge>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="text-foreground">{gpu.provider}</span>
                    {gpu.providerType === 'Marketplace' && (
                        <span className="text-[10px] text-amber-500 mt-0.5">Marketplace</span>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{gpu.vram} GB</TableCell>
            <TableCell className="text-muted-foreground hidden lg:table-cell">
                {gpu.systemSpecs ? (
                    <div className="text-xs">
                        <div>{gpu.systemSpecs.vCPU}vCPU</div>
                        <div>{gpu.systemSpecs.ram}GB RAM</div>
                    </div>
                ) : (
                    <span>-</span>
                )}
            </TableCell>
            <TableCell className="text-right font-mono text-green-600 dark:text-green-400 font-semibold">
                {pricingUnit === 'perGB'
                    ? `$${formatPrice(gpu.price, gpu.vram)}`
                    : formatCurrency(gpu.price)
                }
                {pricingUnit === 'perGB' ? ' /GB/hr' : ' /GPU/hr'}
            </TableCell>
            <TableCell className="text-right text-muted-foreground hidden xl:table-cell">
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
                    <span className="text-xs text-muted-foreground">—</span>
                )}
            </TableCell>
        </TableRow>
    );
}
