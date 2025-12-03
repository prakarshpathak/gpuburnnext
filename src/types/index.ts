export interface GPU {
    id: string | number;
    model: string;
    provider: string;
    price: number;
    vram: number;
    type: 'High-End' | 'Mid-Range' | 'Budget';
    providerType?: 'Cloud' | 'Marketplace';
    lastUpdated?: Date;
    gpuCount?: number; // Number of GPUs in this configuration (1, 2, 4, 8, etc.)
    systemSpecs?: {
        vCPU: number;
        ram: number; // in GB
        storage?: number; // in GB
    };
    signupCredit?: string; // e.g., "Up to $5" or null
    availability?: 'Available' | 'Unavailable';
    launchUrl?: string; // Direct link to provider signup/launch page
    slug?: string; // URL slug for GPU model detail pages
}

export interface Provider {
    id: string;
    name: string;
    slug: string;
    website: string;
    signupCredit?: string;
    description?: string;
    logo?: string;
    referralUrl?: string;
}

export interface GPUModel {
    id: string;
    name: string;
    slug: string;
    vram: number;
    manufacturer: 'NVIDIA' | 'AMD' | 'Intel';
    type: 'High-End' | 'Mid-Range' | 'Budget';
    description?: string;
}
