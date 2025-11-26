import { GPU } from './types';

export const mockGPUs: GPU[] = [
    {
        id: 'gpu-1',
        model: 'NVIDIA H100',
        provider: 'Spheron',
        price: 2.50,
        vram: 80,
        lastUpdated: new Date('2023-11-26T10:00:00Z'),
    },
    {
        id: 'gpu-2',
        model: 'NVIDIA A100',
        provider: 'AWS',
        price: 4.10,
        vram: 80,
        lastUpdated: new Date('2023-11-26T10:05:00Z'),
    },
    {
        id: 'gpu-3',
        model: 'NVIDIA A100',
        provider: 'GCP',
        price: 3.95,
        vram: 40,
        lastUpdated: new Date('2023-11-26T10:10:00Z'),
    },
    {
        id: 'gpu-4',
        model: 'NVIDIA V100',
        provider: 'Lambda',
        price: 0.75,
        vram: 32,
        lastUpdated: new Date('2023-11-26T10:15:00Z'),
    },
    {
        id: 'gpu-5',
        model: 'NVIDIA L40S',
        provider: 'RunPod',
        price: 1.20,
        vram: 48,
        lastUpdated: new Date('2023-11-26T10:20:00Z'),
    },
    // TensorDock
    {
        id: 'gpu-6',
        model: 'Nvidia RTX 5090',
        provider: 'TensorDock',
        price: 0.49,
        vram: 32,
        lastUpdated: new Date('2023-11-26T10:25:00Z'),
        type: 'Mid-Range',
    },
    {
        id: 'gpu-7',
        model: 'Nvidia H100 SXM5',
        provider: 'TensorDock',
        price: 2.00,
        vram: 80,
        lastUpdated: new Date('2023-11-26T10:30:00Z'),
        type: 'High-End',
    },
    // RunPod
    {
        id: 'gpu-8',
        model: 'Nvidia B200',
        provider: 'RunPod',
        price: 5.98,
        vram: 192,
        lastUpdated: new Date('2023-11-26T10:35:00Z'),
        type: 'Ultra', // B200 with 192GB VRAM deserves Ultra tier
    },
    {
        id: 'gpu-9',
        model: 'Nvidia H200',
        provider: 'RunPod',
        price: 3.59,
        vram: 141,
        lastUpdated: new Date('2023-11-26T10:40:00Z'),
        type: 'High-End',
    },
    // Jarvis Labs
    {
        id: 'gpu-10',
        model: 'Nvidia A6000',
        provider: 'Jarvis Labs',
        price: 0.45,
        vram: 48,
        lastUpdated: new Date('2023-11-26T10:45:00Z'),
        type: 'Mid-Range',
    },
    // Massed Compute
    {
        id: 'gpu-11',
        model: 'Nvidia L40S',
        provider: 'Massed Compute',
        price: 0.60,
        vram: 48,
        lastUpdated: new Date('2023-11-26T10:50:00Z'),
        type: 'Mid-Range',
    },
    // CoreWeave
    {
        id: 'gpu-12',
        model: 'Nvidia HGX H100',
        provider: 'CoreWeave',
        price: 2.25,
        vram: 80,
        lastUpdated: new Date('2023-11-26T10:55:00Z'),
        type: 'High-End',
    },
];
