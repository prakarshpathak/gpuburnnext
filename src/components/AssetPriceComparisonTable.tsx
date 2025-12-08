"use client";

import { useState, useMemo } from "react";
import { GPU } from "@/types";
import { TARGET_GPU_MODELS } from "@/lib/data";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { AssetTableFilters } from "./AssetTable/AssetTableFilters";
import { AssetTablePagination } from "./AssetTable/AssetTablePagination";
import { AssetTableRow } from "./AssetTable/AssetTableRow";

interface AssetPriceComparisonTableProps {
    data: GPU[];
}

type SortField = 'model' | 'provider' | 'price' | 'vram' | null;
type SortDirection = 'asc' | 'desc';

export function AssetPriceComparisonTable({ data }: AssetPriceComparisonTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModelFilter, setSelectedModelFilter] = useState<string | null>(null);
    const [selectedAssetType, setSelectedAssetType] = useState<string>("all");
    const [selectedProvider, setSelectedProvider] = useState<string>("all");
    const [pricingUnit, setPricingUnit] = useState<'perStock' | 'perGB'>('perStock');
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    // Popular models for quick filters
    const popularModels = ['Nvidia H100', 'Nvidia H200', 'Nvidia B200', 'Nvidia RTX 5090', 'Nvidia RTX 3090', 'Nvidia RTX 4090'];

    // Get unique values for filters
    const assetTypes = useMemo(() => {
        return Array.from(new Set(data.map(gpu => gpu.type))).filter(Boolean).sort();
    }, [data]);

    const providers = useMemo(() => {
        return Array.from(new Set(data.map(gpu => gpu.provider))).sort();
    }, [data]);

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filtered = [...data];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(gpu =>
                gpu.model.toLowerCase().includes(query) ||
                gpu.provider.toLowerCase().includes(query)
            );
        }

        // Popular model filter - use partial match to catch variants (e.g., "Nvidia H100" matches "Nvidia H100 SXM5")
        if (selectedModelFilter) {
            filtered = filtered.filter(gpu => gpu.model.includes(selectedModelFilter));
        }

        // Asset type filter
        if (selectedAssetType !== 'all') {
            filtered = filtered.filter(gpu => gpu.type === selectedAssetType);
        }

        // Provider filter
        if (selectedProvider !== 'all') {
            filtered = filtered.filter(gpu => gpu.provider === selectedProvider);
        }

        // Sort
        if (sortField) {
            filtered.sort((a, b) => {
                let aVal: string | number;
                let bVal: string | number;

                switch (sortField) {
                    case 'model':
                        aVal = a.model;
                        bVal = b.model;
                        break;
                    case 'provider':
                        aVal = a.provider;
                        bVal = b.provider;
                        break;
                    case 'price':
                        aVal = a.price;
                        bVal = b.price;
                        break;
                    case 'vram':
                        aVal = a.vram;
                        bVal = b.vram;
                        break;
                    default:
                        return 0;
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
            // Default sort: by TARGET_GPU_MODELS order
            filtered.sort((a, b) => {
                const aIndex = TARGET_GPU_MODELS.indexOf(a.model as typeof TARGET_GPU_MODELS[number]);
                const bIndex = TARGET_GPU_MODELS.indexOf(b.model as typeof TARGET_GPU_MODELS[number]);

                // If model not in TARGET_GPU_MODELS, put it at the end
                const aOrder = aIndex === -1 ? 999 : aIndex;
                const bOrder = bIndex === -1 ? 999 : bIndex;

                if (aOrder !== bOrder) {
                    return aOrder - bOrder;
                }

                // If same model, sort by price (cheapest first)
                return a.price - b.price;
            });
        }

        return filtered;
    }, [data, searchQuery, selectedModelFilter, selectedAssetType, selectedProvider, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredAndSortedData.slice(start, end);
    }, [filteredAndSortedData, currentPage, rowsPerPage]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />;
        return sortDirection === 'asc'
            ? <ChevronUp className="w-4 h-4 text-foreground" />
            : <ChevronDown className="w-4 h-4 text-foreground" />;
    };

    const formatPrice = (price: number, vram: number) => {
        if (pricingUnit === 'perGB') {
            return (price / vram).toFixed(4);
        }
        return price.toFixed(2);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 font-pixelify">Asset Price Comparison Table</h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                    Compare all available asset configurations side-by-side. Prices are sorted from lowest to highest to help you find the best deals.
                </p>
            </div>

            {/* Filters */}
            <AssetTableFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedModelFilter={selectedModelFilter}
                setSelectedModelFilter={setSelectedModelFilter}
                selectedAssetType={selectedAssetType}
                setSelectedAssetType={setSelectedAssetType}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                popularModels={popularModels}
                assetTypes={assetTypes}
                providers={providers}
            />

            {/* Results and Pricing Unit Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs md:text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm text-muted-foreground">Pricing Unit:</span>
                    <div className="flex bg-card border border-border rounded-md overflow-hidden">
                        <button
                            onClick={() => setPricingUnit('perStock')}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${pricingUnit === 'perStock'
                                ? 'bg-green-600 text-white'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Per Stock
                        </button>
                        <button
                            onClick={() => setPricingUnit('perGB')}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${pricingUnit === 'perGB'
                                ? 'bg-green-600 text-white'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Per GB VRAM
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-border bg-card overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-accent/50">
                            <TableHead className="cursor-pointer text-foreground font-semibold" onClick={() => handleSort('model')}>
                                <div className="flex items-center gap-2">
                                    Asset Type
                                    {getSortIcon('model')}
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer text-foreground font-semibold" onClick={() => handleSort('provider')}>
                                <div className="flex items-center gap-2">
                                    Provider
                                    {getSortIcon('provider')}
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer text-foreground font-semibold" onClick={() => handleSort('vram')}>
                                <div className="flex items-center gap-2">
                                    VRAM
                                    {getSortIcon('vram')}
                                </div>
                            </TableHead>
                            <TableHead className="text-foreground font-semibold hidden lg:table-cell">System</TableHead>
                            <TableHead className="cursor-pointer text-right text-foreground font-semibold" onClick={() => handleSort('price')}>
                                <div className="flex items-center justify-end gap-2">
                                    Price / Hour
                                    {getSortIcon('price')}
                                </div>
                            </TableHead>
                            <TableHead className="text-right text-foreground font-semibold hidden xl:table-cell">Signup Credit</TableHead>
                            <TableHead className="text-right text-foreground font-semibold"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((gpu) => (
                            <AssetTableRow
                                key={gpu.id}
                                gpu={gpu}
                                pricingUnit={pricingUnit}
                                formatPrice={formatPrice}
                                formatCurrency={formatCurrency}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <AssetTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
