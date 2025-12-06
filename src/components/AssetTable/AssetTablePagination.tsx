import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AssetTablePaginationProps {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    setRowsPerPage: (rows: number) => void;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export function AssetTablePagination({
    currentPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    setCurrentPage,
}: AssetTablePaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={rowsPerPage.toString()} onValueChange={(val) => {
                    setRowsPerPage(Number(val));
                    setCurrentPage(1);
                }}>
                    <SelectTrigger className="w-[80px] bg-background border-input text-foreground">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
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
                    onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="bg-card border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-card border-input text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
