import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SavingsCard() {
    return (
        <Card className="p-8 border-zinc-800 bg-zinc-900/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-white">Compute Cost Comparison</h3>
                    <p className="text-zinc-400">See how much you save with Spheron&apos;s on-demand GPUs compared to major cloud providers.</p>
                    <div className="rounded-lg border border-zinc-800 bg-black/50 p-4">
                        <div className="grid grid-cols-3 text-sm font-medium text-zinc-500 border-b border-zinc-800 pb-2 mb-2">
                            <div>Provider</div>
                            <div>H100/hr</div>
                            <div>A100/hr</div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-3 text-blue-400 font-bold bg-blue-500/10 p-2 rounded">
                                <div>Spheron AI</div><div>$1.99</div><div>$1.50</div>
                            </div>
                            <div className="grid grid-cols-3 text-zinc-300 px-2">
                                <div>Lambda</div><div>$2.49</div><div>$2.20</div>
                            </div>
                            <div className="grid grid-cols-3 text-zinc-300 px-2">
                                <div>AWS</div><div>~$4.25</div><div>~$4.10</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-zinc-800/50 to-black rounded-xl border border-zinc-700">
                    <div className="text-lg text-zinc-400">Up to</div>
                    <div className="text-6xl font-extrabold text-blue-500 my-2">53%</div>
                    <div className="text-sm text-zinc-400 mb-4">Cheaper than Hyperscalers</div>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white w-full">Start Saving Now</Button>
                </div>
            </div>
        </Card>
    )
}

