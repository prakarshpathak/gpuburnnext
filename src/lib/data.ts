import { GPU } from './types';

// Combined GPU data: Original + Expanded configurations with system specs
export const gpuData: GPU[] = [
  // --- Original High-End Enterprise GPUs (for Savings Calculator) ---
  { id: 'h100-spheron', model: 'Nvidia H100', provider: 'Spheron AI', price: 1.99, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 32, ram: 256 }, availability: 'Available', launchUrl: 'https://spheron.network/', slug: 'h100', lastUpdated: new Date() },
  { id: 'b200-runpod', model: 'Nvidia B200', provider: 'RunPod', price: 5.98, vram: 180, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 64, ram: 512 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'b200', lastUpdated: new Date() },
  { id: 'h200-runpod', model: 'Nvidia H200', provider: 'RunPod', price: 3.59, vram: 141, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 48, ram: 384 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'h200', lastUpdated: new Date() },
  { id: 'h100-lambda', model: 'Nvidia H100 SXM', provider: 'Lambda', price: 2.49, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 30, ram: 200 }, availability: 'Available', launchUrl: 'https://cloud.lambdalabs.com/', slug: 'h100', lastUpdated: new Date() },
  { id: 'h100-tensordock', model: 'Nvidia H100 SXM5', provider: 'TensorDock', price: 2.00, vram: 80, type: 'High-End', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 28, ram: 192 }, availability: 'Available', launchUrl: 'https://dashboard.tensordock.com/deploy', slug: 'h100', lastUpdated: new Date() },
  { id: 'h100-coreweave', model: 'Nvidia HGX H100', provider: 'CoreWeave', price: 2.25, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 32, ram: 240 }, availability: 'Available', launchUrl: 'https://www.coreweave.com/', slug: 'h100', lastUpdated: new Date() },
  { id: 'a100-spheron', model: 'Nvidia A100', provider: 'Spheron AI', price: 1.50, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 24, ram: 180 }, availability: 'Available', launchUrl: 'https://spheron.network/', slug: 'a100', lastUpdated: new Date() },
  { id: 'l40s-massed', model: 'Nvidia L40S', provider: 'Massed Compute', price: 0.60, vram: 48, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 16, ram: 128 }, availability: 'Available', launchUrl: 'https://massedcompute.com/', slug: 'l40s', lastUpdated: new Date() },
  { id: 'a6000-jarvis', model: 'Nvidia A6000', provider: 'Jarvis Labs', price: 0.45, vram: 48, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 12, ram: 96 }, availability: 'Available', launchUrl: 'https://jarvislabs.ai/', slug: 'a6000', lastUpdated: new Date() },
  { id: '5090-tensordock', model: 'Nvidia RTX 5090', provider: 'TensorDock', price: 0.49, vram: 32, type: 'Mid-Range', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 16, ram: 64 }, availability: 'Available', launchUrl: 'https://dashboard.tensordock.com/deploy', slug: 'rtx5090', lastUpdated: new Date() },
  { id: '4090-runpod', model: 'Nvidia RTX 4090', provider: 'RunPod', price: 0.34, vram: 24, type: 'Budget', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 8, ram: 32 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'rtx4090', lastUpdated: new Date() },
  { id: '4090-vast', model: 'Nvidia RTX 4090', provider: 'Vast.ai', price: 0.28, vram: 24, type: 'Budget', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 32, ram: 126 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'rtx4090', lastUpdated: new Date() },
  
  // --- Expanded Vast.ai Offerings (Additional multi-GPU configurations) ---
  { id: 'vast-rtx5060ti-1', model: 'Nvidia RTX 5060 Ti', provider: 'Vast.ai', price: 0.03, vram: 16, type: 'Budget', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 28, ram: 31 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'rtx5060ti', lastUpdated: new Date() },
  { id: 'vast-rtx5060ti-2', model: 'Nvidia RTX 5060 Ti', provider: 'Vast.ai', price: 0.03, vram: 16, type: 'Budget', providerType: 'Marketplace', gpuCount: 2, systemSpecs: { vCPU: 56, ram: 63 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'rtx5060ti', lastUpdated: new Date() },
  { id: 'vast-rtx5070ti-1', model: 'Nvidia RTX 5070 Ti', provider: 'Vast.ai', price: 0.07, vram: 16, type: 'Budget', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 12, ram: 30 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'rtx5070ti', lastUpdated: new Date() },
  { id: 'vast-rtx3090-1', model: 'Nvidia RTX 3090', provider: 'Vast.ai', price: 0.08, vram: 24, type: 'Budget', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 9, ram: 10 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'rtx3090', lastUpdated: new Date() },
  { id: 'vast-rtx5080-1', model: 'Nvidia RTX 5080', provider: 'Vast.ai', price: 0.10, vram: 16, type: 'Mid-Range', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 8, ram: 55 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'rtx5080', lastUpdated: new Date() },
  { id: 'vast-l40-1', model: 'Nvidia L40', provider: 'Vast.ai', price: 0.19, vram: 48, type: 'Mid-Range', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 32, ram: 125 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'l40', lastUpdated: new Date() },
  { id: 'vast-l40-3', model: 'Nvidia L40', provider: 'Vast.ai', price: 0.21, vram: 48, type: 'Mid-Range', providerType: 'Marketplace', gpuCount: 3, systemSpecs: { vCPU: 192, ram: 755 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'l40', lastUpdated: new Date() },
  { id: 'vast-rtx4090-2', model: 'Nvidia RTX 4090', provider: 'Vast.ai', price: 0.20, vram: 24, type: 'Mid-Range', providerType: 'Marketplace', gpuCount: 2, systemSpecs: { vCPU: 128, ram: 63 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'rtx4090', lastUpdated: new Date() },
  { id: 'vast-rtx5090-2', model: 'Nvidia RTX 5090', provider: 'Vast.ai', price: 0.22, vram: 32, type: 'Mid-Range', providerType: 'Marketplace', gpuCount: 2, systemSpecs: { vCPU: 48, ram: 62 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'rtx5090', lastUpdated: new Date() },
  { id: 'vast-rtx5090-4', model: 'Nvidia RTX 5090', provider: 'Vast.ai', price: 0.33, vram: 32, type: 'Mid-Range', providerType: 'Marketplace', gpuCount: 4, systemSpecs: { vCPU: 128, ram: 126 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: 'rtx5090', lastUpdated: new Date() },
  { id: 'vast-6000ada-1', model: 'Nvidia RTX 6000 Ada Generation', provider: 'Vast.ai', price: 0.22, vram: 48, type: 'High-End', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 32, ram: 63 }, availability: 'Available', launchUrl: 'https://cloud.vast.ai/?ref_id=258548', slug: '6000ada', lastUpdated: new Date() },
  
  // --- Additional RunPod Multi-GPU Configurations ---
  { id: 'runpod-rtxa4500-1', model: 'Nvidia RTX A4500', provider: 'RunPod', price: 0.25, vram: 20, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 7, ram: 30 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'rtxa4500', lastUpdated: new Date() },
  { id: 'runpod-rtxa4500-2', model: 'Nvidia RTX A4500', provider: 'RunPod', price: 0.25, vram: 20, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 2, systemSpecs: { vCPU: 7, ram: 30 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'rtxa4500', lastUpdated: new Date() },
  { id: 'runpod-rtxa4000-1', model: 'Nvidia RTX A4000', provider: 'RunPod', price: 0.25, vram: 16, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 5, ram: 31 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'rtxa4000', lastUpdated: new Date() },
  { id: 'runpod-rtxa4000-2', model: 'Nvidia RTX A4000', provider: 'RunPod', price: 0.25, vram: 16, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 2, systemSpecs: { vCPU: 5, ram: 31 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'rtxa4000', lastUpdated: new Date() },
  { id: 'runpod-rtxa4000-4', model: 'Nvidia RTX A4000', provider: 'RunPod', price: 0.25, vram: 16, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 4, systemSpecs: { vCPU: 5, ram: 31 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'rtxa4000', lastUpdated: new Date() },
  { id: 'runpod-rtxa4000-8', model: 'Nvidia RTX A4000', provider: 'RunPod', price: 0.25, vram: 16, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 8, systemSpecs: { vCPU: 5, ram: 31 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'rtxa4000', lastUpdated: new Date() },
  // --- High-End Enterprise GPUs ---
  { id: 'h100-spheron', model: 'NVIDIA H100', provider: 'Spheron AI', price: 1.99, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 32, ram: 256 }, availability: 'Available', launchUrl: 'https://spheron.network/', slug: 'h100', lastUpdated: new Date() },
  { id: 'h100-lambda', model: 'NVIDIA H100 SXM', provider: 'Lambda', price: 2.49, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 30, ram: 200 }, availability: 'Available', launchUrl: 'https://cloud.lambdalabs.com/', slug: 'h100', lastUpdated: new Date() },
  { id: 'h100-tensordock', model: 'NVIDIA H100 SXM5', provider: 'TensorDock', price: 2.00, vram: 80, type: 'High-End', providerType: 'Marketplace', gpuCount: 1, systemSpecs: { vCPU: 28, ram: 192 }, availability: 'Available', launchUrl: 'https://dashboard.tensordock.com/deploy', slug: 'h100', lastUpdated: new Date() },
  { id: 'h100-coreweave', model: 'NVIDIA HGX H100', provider: 'CoreWeave', price: 2.25, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 32, ram: 240 }, availability: 'Available', launchUrl: 'https://www.coreweave.com/', slug: 'h100', lastUpdated: new Date() },
  { id: 'h200-runpod', model: 'NVIDIA H200', provider: 'RunPod', price: 3.59, vram: 141, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 48, ram: 384 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'h200', lastUpdated: new Date() },
  { id: 'b200-runpod', model: 'NVIDIA B200', provider: 'RunPod', price: 5.98, vram: 180, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 64, ram: 512 }, signupCredit: 'Up to $5', availability: 'Available', launchUrl: 'https://runpod.io/?ref=ywe09aak', slug: 'b200', lastUpdated: new Date() },
  { id: 'a100-spheron', model: 'NVIDIA A100', provider: 'Spheron AI', price: 1.50, vram: 80, type: 'High-End', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 24, ram: 180 }, availability: 'Available', launchUrl: 'https://spheron.network/', slug: 'a100', lastUpdated: new Date() },
  { id: 'l40s-massed', model: 'NVIDIA L40S', provider: 'Massed Compute', price: 0.60, vram: 48, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 16, ram: 128 }, availability: 'Available', launchUrl: 'https://massedcompute.com/', slug: 'l40s', lastUpdated: new Date() },
  { id: 'a6000-jarvis', model: 'NVIDIA A6000', provider: 'Jarvis Labs', price: 0.45, vram: 48, type: 'Mid-Range', providerType: 'Cloud', gpuCount: 1, systemSpecs: { vCPU: 12, ram: 96 }, availability: 'Available', launchUrl: 'https://jarvislabs.ai/', slug: 'a6000', lastUpdated: new Date() },
];

// Data freshness tracking
let dataLastUpdatedTime = new Date();

export function getDataLastUpdated(): Date {
  return dataLastUpdatedTime;
}

export function updateDataTimestamp(): void {
  dataLastUpdatedTime = new Date();
}

export function getTimeSinceUpdate(): string {
  const now = new Date();
  const diff = now.getTime() - dataLastUpdatedTime.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}
