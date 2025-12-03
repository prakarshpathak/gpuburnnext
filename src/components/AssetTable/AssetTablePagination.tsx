import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AssetTablePaginationProps {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    setRowsPerPage: (rows: number) => void;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    totalResults: number;
}

export function AssetTablePagination({
    currentPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    setCurrentPage,
    totalResults
}: AssetTablePaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                <Select value={rowsPerPage.toString()} onValueChange={(val) => {
                    setRowsPerPage(Number(val));
                    setCurrentPage(1);
                }}>
                    <SelectTrigger className="w-[80px] bg-white dark:bg-[#111111] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-300">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#111111] border-gray-300 dark:border-gray-800">
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
                    className="bg-white dark:bg-[#111111] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-white dark:bg-[#111111] border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
