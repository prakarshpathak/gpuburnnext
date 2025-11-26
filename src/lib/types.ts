export interface GPU {
    id: string;
    model: string;
    provider: string;
    price: number;
    vram: number;
    lastUpdated: Date;
    type?: 'Mid-Range' | 'High-End' | 'Ultra';
}
