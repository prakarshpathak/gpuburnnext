"use client";

import { useState, useMemo } from "react";
import { GPU } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

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
    const popularModels = ['Nvidia H100', 'Nvidia H200', 'Nvidia B200', 'AMD Instinct MI355X', 'Nvidia RTX 5090', 'Nvidia RTX 3090'];

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

        // Popular model filter
        if (selectedModelFilter) {
            filtered = filtered.filter(gpu => gpu.model === selectedModelFilter);
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
                let aVal: any;
                let bVal: any;

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
        if (sortField !== field) return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
        return sortDirection === 'asc' 
            ? <ChevronUp className="w-4 h-4 text-gray-300" />
            : <ChevronDown className="w-4 h-4 text-gray-300" />;
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
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Asset Price Comparison Table</h2>
                <p className="text-sm text-gray-400">
                    Compare all available asset configurations side-by-side. Prices are sorted from lowest to highest to help you find the best deals.
                </p>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search Assets or Providers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#111111] border-gray-800 text-white placeholder:text-gray-500"
                    />
                </div>

                {/* Popular Filters */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium text-gray-400 mr-2">Popular:</span>
                    {popularModels.map(model => (
                        <Button
                            key={model}
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedModelFilter(selectedModelFilter === model ? null : model)}
                            className={`text-xs ${
                                selectedModelFilter === model
                                    ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                                    : 'bg-[#111111] border-gray-800 text-gray-300 hover:bg-[#1a1a1a]'
                            }`}
                        >
                            {model}
                        </Button>
                    ))}
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap gap-4">
                    <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                        <SelectTrigger className="w-[180px] bg-[#111111] border-gray-800 text-gray-300">
                            <SelectValue placeholder="Asset Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-gray-800">
                            <SelectItem value="all">All Asset Types</SelectItem>
                            {assetTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                        <SelectTrigger className="w-[180px] bg-[#111111] border-gray-800 text-gray-300">
                            <SelectValue placeholder="Provider" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-gray-800">
                            <SelectItem value="all">All Providers</SelectItem>
                            {providers.map(provider => (
                                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value="more" disabled>
                        <SelectTrigger className="w-[180px] bg-[#111111] border-gray-800 text-gray-300">
                            <SelectValue placeholder="More Filters" />
                        </SelectTrigger>
                    </Select>
                </div>
            </div>

            {/* Results and Pricing Unit Toggle */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Pricing Unit:</span>
                    <div className="flex bg-[#111111] border border-gray-800 rounded-md overflow-hidden">
                        <button
                            onClick={() => setPricingUnit('perStock')}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${
                                pricingUnit === 'perStock'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Per Stock
                        </button>
                        <button
                            onClick={() => setPricingUnit('perGB')}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${
                                pricingUnit === 'perGB'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Per GB VRAM
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-gray-800 bg-[#111111] overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-[#1a1a1a]">
                            <TableHead className="cursor-pointer text-gray-300" onClick={() => handleSort('model')}>
                                <div className="flex items-center gap-2">
                                    Asset Type
                                    {getSortIcon('model')}
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer text-gray-300" onClick={() => handleSort('provider')}>
                                <div className="flex items-center gap-2">
                                    Provider
                                    {getSortIcon('provider')}
                                </div>
                            </TableHead>
                            <TableHead className="text-gray-300">Units</TableHead>
                            <TableHead className="cursor-pointer text-gray-300" onClick={() => handleSort('vram')}>
                                <div className="flex items-center gap-2">
                                    VRAM
                                    {getSortIcon('vram')}
                                </div>
                            </TableHead>
                            <TableHead className="text-gray-300">System</TableHead>
                            <TableHead className="cursor-pointer text-right text-gray-300" onClick={() => handleSort('price')}>
                                <div className="flex items-center justify-end gap-2">
                                    Price / Unit
                                    {getSortIcon('price')}
                                </div>
                            </TableHead>
                            <TableHead className="text-right text-gray-300">Total Price</TableHead>
                            <TableHead className="text-right text-gray-300">Signup Credit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((gpu) => (
                            <TableRow key={gpu.id} className="border-gray-800 hover:bg-[#1a1a1a]">
                                <TableCell className="font-medium text-gray-200">{gpu.model}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-gray-300">{gpu.provider}</span>
                                        {gpu.providerType === 'Marketplace' && (
                                            <span className="text-[10px] text-amber-500 mt-0.5">Marketplace</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-400">1</TableCell>
                                <TableCell className="text-gray-400">{gpu.vram} GB</TableCell>
                                <TableCell className="text-gray-400">-</TableCell>
                                <TableCell className="text-right font-mono text-green-400">
                                    {pricingUnit === 'perGB' 
                                        ? `$${formatPrice(gpu.price, gpu.vram)}`
                                        : formatCurrency(gpu.price)
                                    }
                                    {pricingUnit === 'perGB' ? ' /GB' : ' /GPU/hr'}
                                </TableCell>
                                <TableCell className="text-right font-mono text-gray-300">
                                    {formatCurrency(gpu.price)} /hr
                                </TableCell>
                                <TableCell className="text-right text-gray-500">-</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Rows per page:</span>
                    <Select value={rowsPerPage.toString()} onValueChange={(val) => {
                        setRowsPerPage(Number(val));
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger className="w-[80px] bg-[#111111] border-gray-800 text-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-gray-800">
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="bg-[#111111] border-gray-800 text-gray-300 hover:bg-[#1a1a1a]"
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-[#111111] border-gray-800 text-gray-300 hover:bg-[#1a1a1a]"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

