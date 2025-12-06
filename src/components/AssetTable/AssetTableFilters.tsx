import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface AssetTableFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedModelFilter: string | null;
    setSelectedModelFilter: (model: string | null) => void;
    selectedAssetType: string;
    setSelectedAssetType: (type: string) => void;
    selectedProvider: string;
    setSelectedProvider: (provider: string) => void;
    popularModels: string[];
    assetTypes: string[];
    providers: string[];
}

export function AssetTableFilters({
    searchQuery,
    setSearchQuery,
    selectedModelFilter,
    setSelectedModelFilter,
    selectedAssetType,
    setSelectedAssetType,
    selectedProvider,
    setSelectedProvider,
    popularModels,
    assetTypes,
    providers
}: AssetTableFiltersProps) {
    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search Assets or Providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
            </div>

            {/* Popular Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-medium text-muted-foreground">Popular:</span>
                {popularModels.map(model => (
                    <Button
                        key={model}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedModelFilter(selectedModelFilter === model ? null : model)}
                        className={`text-xs ${selectedModelFilter === model
                                ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                                : 'bg-card border-input text-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                    >
                        {model}
                    </Button>
                ))}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap gap-4">
                <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-background border-input text-foreground">
                        <SelectValue placeholder="Asset Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">All Asset Types</SelectItem>
                        {assetTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-background border-input text-foreground">
                        <SelectValue placeholder="Provider" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">All Providers</SelectItem>
                        {providers.map(provider => (
                            <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
