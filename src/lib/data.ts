import { GPU } from './types';

export const gpuData: GPU[] = [
  // --- High-End Enterprise (H100/B200) ---
  { id: 'h100-spheron', model: 'Nvidia H100', provider: 'Spheron AI', price: 1.99, vram: 80, type: 'High-End', providerType: 'Cloud', lastUpdated: new Date() },
  { id: 'b200-runpod', model: 'Nvidia B200', provider: 'RunPod', price: 5.98, vram: 180, type: 'High-End', providerType: 'Cloud', lastUpdated: new Date() },
  { id: 'h200-runpod', model: 'Nvidia H200', provider: 'RunPod', price: 3.59, vram: 141, type: 'High-End', providerType: 'Cloud', lastUpdated: new Date() },
  { id: 'h100-lambda', model: 'Nvidia H100 SXM', provider: 'Lambda', price: 2.49, vram: 80, type: 'High-End', providerType: 'Cloud', lastUpdated: new Date() },
  { id: 'h100-tensordock', model: 'Nvidia H100 SXM5', provider: 'TensorDock', price: 2.00, vram: 80, type: 'High-End', providerType: 'Marketplace', lastUpdated: new Date() },
  { id: 'h100-coreweave', model: 'Nvidia HGX H100', provider: 'CoreWeave', price: 2.25, vram: 80, type: 'High-End', providerType: 'Cloud', lastUpdated: new Date() },
  
  // --- Mid-Range / Inference (A100/L40S) ---
  { id: 'a100-spheron', model: 'Nvidia A100', provider: 'Spheron AI', price: 1.50, vram: 80, type: 'High-End', providerType: 'Cloud', lastUpdated: new Date() },
  { id: 'l40s-massed', model: 'Nvidia L40S', provider: 'Massed Compute', price: 0.60, vram: 48, type: 'Mid-Range', providerType: 'Cloud', lastUpdated: new Date() },
  { id: 'a6000-jarvis', model: 'Nvidia A6000', provider: 'Jarvis Labs', price: 0.45, vram: 48, type: 'Mid-Range', providerType: 'Cloud', lastUpdated: new Date() },
  
  // --- Budget / Consumer (RTX 4090/5090) ---
  { id: '5090-tensordock', model: 'Nvidia RTX 5090', provider: 'TensorDock', price: 0.49, vram: 32, type: 'Mid-Range', providerType: 'Marketplace', lastUpdated: new Date() },
  { id: '4090-runpod', model: 'Nvidia RTX 4090', provider: 'RunPod', price: 0.34, vram: 24, type: 'Budget', providerType: 'Cloud', lastUpdated: new Date() },
  { id: '4090-vast', model: 'Nvidia RTX 4090', provider: 'Vast.ai', price: 0.28, vram: 24, type: 'Budget', providerType: 'Marketplace', lastUpdated: new Date() },
];
